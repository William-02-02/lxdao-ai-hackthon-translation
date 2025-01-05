// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TranslationDAO is Ownable, ReentrancyGuard {
    IERC20 public paymentToken;
    uint256 public constant VOTE_THRESHOLD = 3;
    
    struct Task {
        address creator;
        uint256 bounty;
        TaskStatus status;
        mapping(uint256 => Paragraph) paragraphs;
        uint256 paragraphCount;
        string sourceLanguage;
        string targetLanguage;
        string title;
    }
    
    struct Paragraph {
        string content;
        string translation;
        ParagraphStatus status;
        mapping(address => Vote) votes;
        address[] voters;
        uint256 approveCount;
        uint256 rejectCount;
    }
    
    struct Vote {
        bool approved;
        string comment;
        uint256 timestamp;
    }
    
    enum TaskStatus { Pending, Translating, Reviewing, Completed }
    enum ParagraphStatus { Pending, Translated, Approved, Rejected }
    
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    
    // 用户角色
    mapping(address => bool) public translators;
    mapping(address => bool) public reviewers;
    
    // 用户统计
    mapping(address => uint256) public userCompletedTasks;
    mapping(address => uint256) public userCompletedReviews;
    mapping(address => uint256) public userEarnings;
    
    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 bounty);
    event TranslationSubmitted(uint256 indexed taskId, uint256 paragraphId, string translation);
    event VoteSubmitted(uint256 indexed taskId, uint256 paragraphId, address indexed voter, bool approved);
    event ParagraphApproved(uint256 indexed taskId, uint256 paragraphId);
    event TaskCompleted(uint256 indexed taskId);
    
    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }
    
    modifier onlyTranslator() {
        require(translators[msg.sender], "Not a translator");
        _;
    }
    
    modifier onlyReviewer() {
        require(reviewers[msg.sender], "Not a reviewer");
        _;
    }
    
    function createTask(
        string memory _title,
        string memory _sourceLanguage,
        string memory _targetLanguage,
        string[] memory _contents,
        uint256 _bounty
    ) external nonReentrant {
        require(_contents.length > 0, "Empty content");
        require(_bounty > 0, "Invalid bounty");
        require(
            paymentToken.transferFrom(msg.sender, address(this), _bounty),
            "Transfer failed"
        );
        
        uint256 taskId = taskCount++;
        Task storage task = tasks[taskId];
        task.creator = msg.sender;
        task.bounty = _bounty;
        task.status = TaskStatus.Pending;
        task.title = _title;
        task.sourceLanguage = _sourceLanguage;
        task.targetLanguage = _targetLanguage;
        
        for (uint256 i = 0; i < _contents.length; i++) {
            Paragraph storage para = task.paragraphs[i];
            para.content = _contents[i];
            para.status = ParagraphStatus.Pending;
        }
        task.paragraphCount = _contents.length;
        
        emit TaskCreated(taskId, msg.sender, _bounty);
    }
    
    function submitTranslation(
        uint256 _taskId,
        uint256 _paragraphId,
        string memory _translation
    ) external onlyTranslator {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Pending || task.status == TaskStatus.Translating, "Invalid task status");
        require(_paragraphId < task.paragraphCount, "Invalid paragraph");
        
        Paragraph storage para = task.paragraphs[_paragraphId];
        require(para.status == ParagraphStatus.Pending, "Already translated");
        
        para.translation = _translation;
        para.status = ParagraphStatus.Translated;
        task.status = TaskStatus.Translating;
        
        emit TranslationSubmitted(_taskId, _paragraphId, _translation);
    }
    
    function submitVote(
        uint256 _taskId,
        uint256 _paragraphId,
        bool _approved,
        string memory _comment
    ) external onlyReviewer {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Translating || task.status == TaskStatus.Reviewing, "Invalid task status");
        require(_paragraphId < task.paragraphCount, "Invalid paragraph");
        
        Paragraph storage para = task.paragraphs[_paragraphId];
        require(para.status == ParagraphStatus.Translated, "Not ready for review");
        require(!hasVoted(_taskId, _paragraphId, msg.sender), "Already voted");
        
        para.votes[msg.sender] = Vote({
            approved: _approved,
            comment: _comment,
            timestamp: block.timestamp
        });
        para.voters.push(msg.sender);
        
        if (_approved) {
            para.approveCount++;
            if (para.approveCount >= VOTE_THRESHOLD) {
                para.status = ParagraphStatus.Approved;
                emit ParagraphApproved(_taskId, _paragraphId);
            }
        } else {
            para.rejectCount++;
            if (para.rejectCount >= VOTE_THRESHOLD) {
                para.status = ParagraphStatus.Rejected;
            }
        }
        
        task.status = TaskStatus.Reviewing;
        userCompletedReviews[msg.sender]++;
        
        emit VoteSubmitted(_taskId, _paragraphId, msg.sender, _approved);
        
        checkTaskCompletion(_taskId);
    }
    
    function hasVoted(uint256 _taskId, uint256 _paragraphId, address _voter) public view returns (bool) {
        Task storage task = tasks[_taskId];
        Paragraph storage para = task.paragraphs[_paragraphId];
        for (uint256 i = 0; i < para.voters.length; i++) {
            if (para.voters[i] == _voter) {
                return true;
            }
        }
        return false;
    }
    
    function checkTaskCompletion(uint256 _taskId) internal {
        Task storage task = tasks[_taskId];
        bool allApproved = true;
        
        for (uint256 i = 0; i < task.paragraphCount; i++) {
            if (task.paragraphs[i].status != ParagraphStatus.Approved) {
                allApproved = false;
                break;
            }
        }
        
        if (allApproved) {
            task.status = TaskStatus.Completed;
            distributeRewards(_taskId);
            emit TaskCompleted(_taskId);
        }
    }
    
    function distributeRewards(uint256 _taskId) internal {
        Task storage task = tasks[_taskId];
        uint256 translatorReward = task.bounty * 70 / 100;  // 70% to translator
        uint256 reviewerReward = task.bounty * 30 / 100;    // 30% to reviewers
        
        // 分配给翻译者
        address translator = task.creator;  // 简化版本，假设创建者就是翻译者
        paymentToken.transfer(translator, translatorReward);
        userEarnings[translator] += translatorReward;
        userCompletedTasks[translator]++;
        
        // 分配给审核者
        uint256 rewardPerReviewer = reviewerReward / VOTE_THRESHOLD;
        for (uint256 i = 0; i < task.paragraphCount; i++) {
            Paragraph storage para = task.paragraphs[i];
            for (uint256 j = 0; j < VOTE_THRESHOLD; j++) {
                address reviewer = para.voters[j];
                paymentToken.transfer(reviewer, rewardPerReviewer);
                userEarnings[reviewer] += rewardPerReviewer;
            }
        }
    }
    
    // 管理功能
    function addTranslator(address _translator) external onlyOwner {
        translators[_translator] = true;
    }
    
    function addReviewer(address _reviewer) external onlyOwner {
        reviewers[_reviewer] = true;
    }
    
    function removeTranslator(address _translator) external onlyOwner {
        translators[_translator] = false;
    }
    
    function removeReviewer(address _reviewer) external onlyOwner {
        reviewers[_reviewer] = false;
    }
} 