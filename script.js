/**
 * ============================================================================
 * PROJECT: BROWSER HISTORY MANAGER (DSA MINI-PROJECT)
 * TARGET AUDIENCE: 2nd Year B.Tech Computer Science Students & College Viva
 * 
 * CORE DATA STRUCTURES IMPLEMENTED:
 * 1. DOUBLY LINKED LIST: Used for Browser Session Navigation (Back & Forward)
 *    - Time Complexity: O(1) for Back, Forward, and appending new page
 *    - Space Complexity: O(N) where N is the number of session pages
 * 
 * 2. ARRAY: Used for Comprehensive History Log, Storage & Search
 *    - Time Complexity: O(1) for insertion, O(N) for Linear Search traversal
 *    - Space Complexity: O(M) where M is the total visited page records
 * ============================================================================
 */

// ============================================================================
// PART 1: LINKED LIST IMPLEMENTATION (NODES & DOUBLY LINKED LIST)
// ============================================================================

/**
 * Class representing an individual Node in the Doubly Linked List.
 * Each node stores:
 *  - url: The website address (string)
 *  - title: A friendly website name/title (string)
 *  - timestamp: The date and time of visit (string)
 *  - prev: Pointer to the previous node (for Back navigation)
 *  - next: Pointer to the next node (for Forward navigation)
 */
class HistoryNode {
    constructor(url, title, timestamp) {
        this.id = 'node_' + Math.random().toString(36).substr(2, 9);
        this.url = url;
        this.title = title;
        this.timestamp = timestamp;
        
        // Pointers for Doubly Linked List
        this.prev = null; // Pointer to previous page in navigation session
        this.next = null; // Pointer to next page in navigation session
    }
}

/**
 * Class representing the Doubly Linked List for active browser session.
 * 
 * Why Doubly Linked List for Browser Navigation?
 * - A singly linked list only moves forward (next), making "Back" navigation impossible in O(1).
 * - A Doubly Linked List provides bidirectional pointers (`prev` and `next`),
 *   allowing instant O(1) step backward and forward.
 * - When visiting a new page from the middle of history, all "forward" nodes
 *   are discarded, exactly how Google Chrome or Mozilla Firefox behaves.
 */
class DoublyLinkedList {
    constructor() {
        this.head = null;    // First page visited in this session
        this.tail = null;    // Last page visited in this session
        this.current = null; // Pointer to the currently viewed page
        this.size = 0;       // Total count of active nodes in the chain
    }

    /**
     * Visit a new URL: Inserts a new node into the Doubly Linked List.
     * @param {string} url - Website URL
     * @param {string} title - Website friendly name
     * @param {string} timestamp - Visit timestamp
     * @returns {HistoryNode} - The newly created node
     */
    visit(url, title, timestamp) {
        const newNode = new HistoryNode(url, title, timestamp);

        // CASE 1: The linked list is currently empty
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
            this.size = 1;
            return newNode;
        }

        // CASE 2: User navigated Back and is now visiting a NEW website.
        // Standard Browser Behavior: Discard/truncate any forward history ahead of 'current'.
        if (this.current && this.current.next) {
            // Cut off forward link
            this.current.next = null;
            this.tail = this.current;
            // Note: In garbage-collected languages like JS, orphaned forward nodes are freed automatically.
        }

        // Attach the new node after the 'current' node
        newNode.prev = this.current;
        this.current.next = newNode;
        
        // Move current and tail to the new node
        this.current = newNode;
        this.tail = newNode;
        
        this.size++;
        return newNode;
    }

    /**
     * Move backward one step in history (Back Button)
     * Time Complexity: O(1) Constant Time
     * @returns {HistoryNode|null} The previous node, or null if at beginning
     */
    goBack() {
        if (this.hasPrev()) {
            this.current = this.current.prev;
            return this.current;
        }
        return null;
    }

    /**
     * Move forward one step in history (Forward Button)
     * Time Complexity: O(1) Constant Time
     * @returns {HistoryNode|null} The next node, or null if at end
     */
    goForward() {
        if (this.hasNext()) {
            this.current = this.current.next;
            return this.current;
        }
        return null;
    }

    /**
     * Checks if Back navigation is possible
     * @returns {boolean}
     */
    hasPrev() {
        return Boolean(this.current && this.current.prev);
    }

    /**
     * Checks if Forward navigation is possible
     * @returns {boolean}
     */
    hasNext() {
        return Boolean(this.current && this.current.next);
    }

    /**
     * Clears all nodes from the Doubly Linked List
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;
    }

    /**
     * Converts the linked list chain into an array of node representations.
     * Used for rendering the DSA Visualizer inspector.
     * Traversal Complexity: O(N)
     * @returns {Array} Array of node objects
     */
    toArray() {
        const nodes = [];
        let temp = this.head;
        let index = 0;

        while (temp !== null) {
            nodes.push({
                index: index,
                id: temp.id,
                url: temp.url,
                title: temp.title,
                timestamp: temp.timestamp,
                isCurrent: (temp === this.current),
                hasPrev: Boolean(temp.prev),
                hasNext: Boolean(temp.next)
            });
            temp = temp.next;
            index++;
        }

        return nodes;
    }
}


// ============================================================================
// PART 2: ARRAY IMPLEMENTATION (HISTORY STORAGE & LINEAR SEARCH)
// ============================================================================

/**
 * Array to store the complete, persistent history of all visited websites.
 * 
 * Why an Array for History Log?
 * 1. Arrays provide linear storage with fast sequential iteration.
 * 2. Elements are indexed (0, 1, 2, ...), allowing direct indexing and order preservation.
 * 3. Array operations like unshift/push allow easy chronological ordering.
 * 4. We can demonstrate fundamental search algorithms like LINEAR SEARCH.
 */
let historyLogArray = [];

/**
 * Add a new visited website record to the History Array.
 * We use `unshift` so that the newest website always sits at index 0 (top of the list).
 * Time Complexity: O(N) for unshift (elements shifted right) or O(1) amortized for push.
 * 
 * @param {string} url - Website URL
 * @param {string} title - Website Title
 * @param {string} timestamp - Visit Timestamp
 * @returns {object} The created history entry
 */
function addToHistoryArray(url, title, timestamp) {
    const historyItem = {
        id: 'hist_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        url: url,
        title: title,
        timestamp: timestamp,
        visitedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Prepend to array: newest first
    historyLogArray.unshift(historyItem);
    return historyItem;
}

/**
 * LINEAR SEARCH ALGORITHM OVER THE HISTORY ARRAY:
 * 
 * Algorithm:
 * 1. Receive the search query string.
 * 2. Convert query to lowercase for case-insensitive matching.
 * 3. Initialize an empty array `results`.
 * 4. Loop through each element `historyLogArray[i]` from index 0 to length - 1.
 * 5. If query is a substring of URL OR Title, add element to `results`.
 * 6. Return `results`.
 * 
 * Time Complexity: O(N) where N is number of history records.
 * Space Complexity: O(K) where K is number of matching results.
 * 
 * @param {string} query - The search text
 * @returns {Array} Filtered list of matching history items
 */
function searchHistoryArray(query) {
    const trimmedQuery = query.trim().toLowerCase();

    // If query is empty, return complete array
    if (!trimmedQuery) {
        return historyLogArray;
    }

    const matchedResults = [];

    // Explicit linear search loop demonstrating DSA fundamentals
    for (let i = 0; i < historyLogArray.length; i++) {
        const item = historyLogArray[i];
        const matchUrl = item.url.toLowerCase().includes(trimmedQuery);
        const matchTitle = item.title.toLowerCase().includes(trimmedQuery);

        if (matchUrl || matchTitle) {
            matchedResults.push(item);
        }
    }

    return matchedResults;
}

/**
 * Remove an item from the History Array by its unique ID.
 * Demonstrates element removal and array index manipulation.
 * Time Complexity: O(N) to find index + O(N) to splice = O(N)
 * 
 * @param {string} id - The ID of the item to delete
 */
function deleteItemFromHistoryArray(id) {
    // Linear search for item index
    let targetIndex = -1;
    for (let i = 0; i < historyLogArray.length; i++) {
        if (historyLogArray[i].id === id) {
            targetIndex = i;
            break;
        }
    }

    if (targetIndex !== -1) {
        // Remove 1 element at targetIndex
        historyLogArray.splice(targetIndex, 1);
        return true;
    }
    return false;
}

/**
 * Clear the entire History Array.
 * Time Complexity: O(1)
 */
function clearHistoryArray() {
    historyLogArray = [];
}


// ============================================================================
// PART 3: APPLICATION STATE & CONTROLLER LOGIC
// ============================================================================

// Instantiate the Doubly Linked List for active browser navigation session
const sessionList = new DoublyLinkedList();

// Website metadata dictionary to generate clean visual mockups for popular domains
const SITE_PREVIEWS = {
    'google.com': {
        title: 'Google',
        icon: '🔍',
        color: '#4285F4',
        heroTitle: 'Google Search',
        heroDesc: 'Search the world\'s information, including webpages, images, videos and more.',
        category: 'Search Engine'
    },
    'wikipedia.org': {
        title: 'Wikipedia, the free encyclopedia',
        icon: '📚',
        color: '#ffffff',
        heroTitle: 'Welcome to Wikipedia',
        heroDesc: 'The free knowledge base that anyone can edit. 6,800,000+ articles in English.',
        category: 'Reference & Education'
    },
    'github.com': {
        title: 'GitHub: Let\'s build from here',
        icon: '🐙',
        color: '#2dba4e',
        heroTitle: 'Where the world builds software',
        heroDesc: 'Millions of developers and companies build, ship, and maintain their software on GitHub.',
        category: 'Developer Platform'
    },
    'geeksforgeeks.org': {
        title: 'GeeksforGeeks | A Computer Science Portal',
        icon: '💻',
        color: '#2f8d46',
        heroTitle: 'Data Structures and Algorithms',
        heroDesc: 'Master Linked Lists, Arrays, Trees, Graphs, and Dynamic Programming with detailed tutorials.',
        category: 'Computer Science & DSA'
    },
    'youtube.com': {
        title: 'YouTube',
        icon: '▶️',
        color: '#FF0000',
        heroTitle: 'Enjoy the videos and music you love',
        heroDesc: 'Upload original content, and share it all with friends, family, and the world on YouTube.',
        category: 'Video Streaming'
    },
    'stackoverflow.com': {
        title: 'Stack Overflow - Where Developers Learn & Share',
        icon: '🥞',
        color: '#f48024',
        heroTitle: 'Every developer has a tab open to Stack Overflow',
        heroDesc: 'Empowering the world to develop technology through collective knowledge.',
        category: 'Q&A Community'
    }
};

/**
 * Helper to normalize and sanitize entered URLs
 * @param {string} input - User input string
 * @returns {object} { sanitizedUrl, domain, title, icon }
 */
function parseUrlDetails(input) {
    let raw = input.trim();
    if (!raw) return null;

    // Prepend https:// if protocol is missing
    let fullUrl = raw;
    if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = 'https://' + fullUrl;
    }

    let domain = '';
    try {
        const parsed = new URL(fullUrl);
        domain = parsed.hostname.replace(/^www\./, '').toLowerCase();
    } catch (e) {
        // Fallback for simple domain strings
        domain = raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].toLowerCase();
        fullUrl = 'https://' + domain;
    }

    // Check if we have preset metadata for this site
    let siteMeta = SITE_PREVIEWS[domain];
    if (!siteMeta) {
        // Derive clean title from domain
        const cleanDomain = domain.split('.')[0];
        const formattedTitle = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
        siteMeta = {
            title: `${formattedTitle} - Web Application`,
            icon: '🌐',
            color: '#58a6ff',
            heroTitle: `Welcome to ${formattedTitle}`,
            heroDesc: `You are browsing ${fullUrl}. This page is rendered dynamically in the Browser History Manager simulator.`,
            category: 'Web Page'
        };
    }

    return {
        url: fullUrl,
        domain: domain,
        title: siteMeta.title,
        icon: siteMeta.icon,
        color: siteMeta.color,
        heroTitle: siteMeta.heroTitle,
        heroDesc: siteMeta.heroDesc,
        category: siteMeta.category
    };
}


// ============================================================================
// PART 4: DOM ELEMENT REFERENCES
// ============================================================================

// Navigation & Toolbar Elements
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const homeBtn = document.getElementById('homeBtn');
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const clearUrlInputBtn = document.getElementById('clearUrlInputBtn');
const visitBtn = document.getElementById('visitBtn');

// Browser Tab & Viewport Elements
const tabFavicon = document.getElementById('tabFavicon');
const tabTitle = document.getElementById('tabTitle');
const browserViewport = document.getElementById('browserViewport');
const pageDisplay = document.getElementById('pageDisplay');

// Browser Status Bar Elements
const networkStatus = document.getElementById('networkStatus');
const currentPageIndicator = document.getElementById('currentPageIndicator');
const dsaStatusIndicator = document.getElementById('dsaStatusIndicator');

// Side Panel & History Elements
const historyCountBadge = document.getElementById('historyCountBadge');
const historyList = document.getElementById('historyList');
const searchHistoryInput = document.getElementById('searchHistoryInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchResultInfo = document.getElementById('searchResultInfo');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Visualizer Elements
const linkedListVisualizer = document.getElementById('linkedListVisualizer');
const arrayVisualizer = document.getElementById('arrayVisualizer');
const refreshVisualizerBtn = document.getElementById('refreshVisualizerBtn');
const toggleDsaPanelBtn = document.getElementById('toggleDsaPanelBtn');

// Tab Navigation in Side Panel
const sidePanelTabs = document.querySelectorAll('.panel-tab');
const tabPanes = document.querySelectorAll('.tab-pane');

// Toast Notification
const toastNotification = document.getElementById('toastNotification');


// ============================================================================
// PART 5: CORE BROWSER CONTROLLER ACTIONS
// ============================================================================

/**
 * Action: VISIT A NEW WEBSITE
 * Triggered by: URL form submission, bookmark click, or history item click
 * 
 * Data Structure Actions:
 * 1. Linked List: sessionList.visit(url, title, timestamp)
 * 2. Array: addToHistoryArray(url, title, timestamp)
 * 
 * @param {string} inputUrl - The URL entered or selected
 */
function handleVisitWebsite(inputUrl) {
    const details = parseUrlDetails(inputUrl);
    if (!details) {
        showToast('⚠️ Please enter a valid URL');
        return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. ADD TO LINKED LIST (for Back/Forward session)
    sessionList.visit(details.url, details.title, timestamp);

    // 2. ADD TO ARRAY (for persistent history log)
    addToHistoryArray(details.url, details.title, timestamp);

    // 3. UPDATE ALL UI COMPONENTS
    updateCompleteUI();
    showToast(`Visited: ${details.title}`);
}

/**
 * Action: BACK BUTTON CLICK
 * 
 * Data Structure Action:
 * - Linked List: sessionList.goBack() moves pointer `current = current.prev`
 * Time Complexity: O(1)
 */
function handleBackNavigation() {
    if (!sessionList.hasPrev()) {
        showToast('ℹ️ No previous page in history');
        return;
    }

    const prevNode = sessionList.goBack();
    if (prevNode) {
        updateCompleteUI();
        showToast(`Back to: ${prevNode.title}`);
    }
}

/**
 * Action: FORWARD BUTTON CLICK
 * 
 * Data Structure Action:
 * - Linked List: sessionList.goForward() moves pointer `current = current.next`
 * Time Complexity: O(1)
 */
function handleForwardNavigation() {
    if (!sessionList.hasNext()) {
        showToast('ℹ️ No forward page in history');
        return;
    }

    const nextNode = sessionList.goForward();
    if (nextNode) {
        updateCompleteUI();
        showToast(`Forward to: ${nextNode.title}`);
    }
}

/**
 * Action: RELOAD CURRENT PAGE
 */
function handleReloadPage() {
    if (sessionList.current) {
        networkStatus.textContent = 'Status: Reloading...';
        setTimeout(() => {
            updateCompleteUI();
            networkStatus.textContent = 'Status: Ready (HTTP 200 OK)';
            showToast(`Reloaded: ${sessionList.current.title}`);
        }, 200);
    } else {
        renderHomePage();
        showToast('Home page refreshed');
    }
}

/**
 * Action: HOME BUTTON CLICK
 */
function handleHomeNavigation() {
    renderHomePage();
    showToast('Switched to Home Screen');
}

/**
 * Action: CLEAR ALL HISTORY
 * 
 * Data Structure Actions:
 * 1. Array: clearHistoryArray() resets historyLogArray = []
 * 2. Linked List: sessionList.clear() resets head, tail, current
 */
function handleClearAllHistory() {
    if (historyLogArray.length === 0 && !sessionList.current) {
        showToast('History is already empty');
        return;
    }

    const confirmClear = confirm('Are you sure you want to clear all browser history and reset navigation?');
    if (!confirmClear) return;

    // Clear Array
    clearHistoryArray();

    // Clear Linked List
    sessionList.clear();

    // Reset UI
    renderHomePage();
    renderHistoryList();
    renderVisualizer();
    updateNavigationControls();

    showToast('🗑️ All History and Linked List Nodes Cleared!');
}

/**
 * Action: DELETE SPECIFIC HISTORY ITEM
 * 
 * Data Structure Action:
 * - Array: deleteItemFromHistoryArray(id) removes element at index
 * @param {string} id - History entry id
 */
function handleDeleteHistoryItem(id) {
    const deleted = deleteItemFromHistoryArray(id);
    if (deleted) {
        // Re-render history list with current search query if any
        const currentQuery = searchHistoryInput.value;
        const results = searchHistoryArray(currentQuery);
        renderHistoryList(results);
        renderVisualizer();
        updateCountBadge();
        showToast('Deleted 1 item from History Array');
    }
}


// ============================================================================
// PART 6: UI RENDERING FUNCTIONS
// ============================================================================

/**
 * Master UI updater: coordinates updating all UI sections
 */
function updateCompleteUI() {
    updateNavigationControls();
    renderCurrentPage();
    renderHistoryList();
    renderVisualizer();
    updateCountBadge();
}

/**
 * Updates Back and Forward buttons based on Linked List pointers
 */
function updateNavigationControls() {
    const canGoBack = sessionList.hasPrev();
    const canGoForward = sessionList.hasNext();

    backBtn.disabled = !canGoBack;
    forwardBtn.disabled = !canGoForward;

    // Update address bar value with current URL
    if (sessionList.current) {
        urlInput.value = sessionList.current.url;
        clearUrlInputBtn.style.display = 'block';
    } else {
        urlInput.value = '';
        clearUrlInputBtn.style.display = 'none';
    }

    // Update Status Bar info
    if (sessionList.current) {
        currentPageIndicator.textContent = `Current: ${sessionList.current.title}`;
        dsaStatusIndicator.textContent = `Node: [${sessionList.current.title.substring(0, 15)}...]`;
        networkStatus.textContent = 'Status: HTTP 200 OK (Loaded)';
    } else {
        currentPageIndicator.textContent = 'Current: Home (New Tab)';
        dsaStatusIndicator.textContent = 'Active Node: null';
        networkStatus.textContent = 'Status: Ready';
    }
}

/**
 * Render the Active Website Card in the Browser Viewport
 */
function renderCurrentPage() {
    if (!sessionList.current) {
        renderHomePage();
        return;
    }

    const currentUrl = sessionList.current.url;
    const details = parseUrlDetails(currentUrl);

    // Update browser Tab
    tabFavicon.textContent = details.icon;
    tabTitle.textContent = details.title;

    // Generate response metrics
    const simulatedLoadTime = Math.floor(Math.random() * 35 + 25); // e.g. 25ms - 60ms

    pageDisplay.innerHTML = `
        <div class="webpage-card">
            <!-- Simulated Website Header -->
            <div class="webpage-card-header">
                <div class="site-meta-left">
                    <div class="site-badge-icon" style="color: ${details.color}">
                        ${details.icon}
                    </div>
                    <div class="site-title-box">
                        <h3>${escapeHtml(details.title)}</h3>
                        <a href="${escapeHtml(details.url)}" target="_blank" rel="noopener noreferrer" class="site-url-link" title="Open in real new tab">
                            ${escapeHtml(details.url)} &#8599;
                        </a>
                    </div>
                </div>
                <div class="site-meta-tags">
                    <span class="meta-pill status-200">200 OK</span>
                    <span class="meta-pill proto">HTTPS / TLS 1.3</span>
                    <span class="meta-pill time">${simulatedLoadTime}ms</span>
                </div>
            </div>

            <!-- Simulated Webpage Content -->
            <div class="webpage-body">
                <div class="hero-preview">
                    <h4>${escapeHtml(details.heroTitle)}</h4>
                    <p>${escapeHtml(details.heroDesc)}</p>
                </div>

                <!-- Technical & DSA Inspection Stats for this page -->
                <div class="page-insights-grid">
                    <div class="insight-card">
                        <div class="insight-label">Current Data Structure Node</div>
                        <div class="insight-val" style="color: #79c0ff;">HistoryNode (Active)</div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-label">Previous Node Pointer</div>
                        <div class="insight-val">
                            ${sessionList.current.prev ? escapeHtml(sessionList.current.prev.title.substring(0, 18)) + '...' : '<span style="color:#6e7681">null (Start of List)</span>'}
                        </div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-label">Next Node Pointer</div>
                        <div class="insight-val">
                            ${sessionList.current.next ? escapeHtml(sessionList.current.next.title.substring(0, 18)) + '...' : '<span style="color:#6e7681">null (End of List)</span>'}
                        </div>
                    </div>
                </div>

                <!-- Page Action Buttons -->
                <div class="page-actions-bar">
                    <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${escapeHtml(details.url)}'); showToast('📋 URL copied to clipboard!');">
                        📋 Copy URL
                    </button>
                    <a href="${escapeHtml(details.url)}" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none;">
                        🌐 Open Real Site &#8599;
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the default Browser Home Screen when no page is active
 */
function renderHomePage() {
    tabFavicon.textContent = '🏠';
    tabTitle.textContent = 'Home - New Tab';
    urlInput.value = '';
    clearUrlInputBtn.style.display = 'none';

    pageDisplay.innerHTML = `
        <div class="home-screen">
            <div class="home-logo-circle">🌐</div>
            <h2>Browser History Manager</h2>
            <p>
                A College-Level Data Structures Project demonstrating how modern web browsers
                utilize <strong>Doubly Linked Lists</strong> for bidirectional page navigation 
                and <strong>Arrays</strong> for comprehensive history storage and linear search.
            </p>

            <div class="home-quick-grid">
                <div class="quick-card" onclick="handleVisitWebsite('https://google.com')">
                    <div class="qc-icon">🔍</div>
                    <div class="qc-title">Google</div>
                    <div class="qc-desc">Search Engine</div>
                </div>
                <div class="quick-card" onclick="handleVisitWebsite('https://wikipedia.org')">
                    <div class="qc-icon">📚</div>
                    <div class="qc-title">Wikipedia</div>
                    <div class="qc-desc">Free Encyclopedia</div>
                </div>
                <div class="quick-card" onclick="handleVisitWebsite('https://github.com')">
                    <div class="qc-icon">🐙</div>
                    <div class="qc-title">GitHub</div>
                    <div class="qc-desc">Developer Platform</div>
                </div>
                <div class="quick-card" onclick="handleVisitWebsite('https://geeksforgeeks.org')">
                    <div class="qc-icon">💻</div>
                    <div class="qc-title">GeeksforGeeks</div>
                    <div class="qc-desc">DSA & Computer Science</div>
                </div>
                <div class="quick-card" onclick="handleVisitWebsite('https://youtube.com')">
                    <div class="qc-icon">▶️</div>
                    <div class="qc-title">YouTube</div>
                    <div class="qc-desc">Video Streaming</div>
                </div>
                <div class="quick-card" onclick="handleVisitWebsite('https://stackoverflow.com')">
                    <div class="qc-icon">🥞</div>
                    <div class="qc-title">Stack Overflow</div>
                    <div class="qc-desc">Developer Q&A</div>
                </div>
            </div>

            <div class="home-tip-box">
                💡 <strong>Try this to see Doubly Linked List in action:</strong> 
                Visit 3 websites, click <strong>Back</strong> twice, then visit a brand new website. 
                Watch how the forward pointers automatically get truncated in the <em>DSA Visualizer</em>!
            </div>
        </div>
    `;
}

/**
 * Render the History List from the Array
 * @param {Array} itemsToRender - Defaults to all items in historyLogArray
 */
function renderHistoryList(itemsToRender = null) {
    const list = itemsToRender !== null ? itemsToRender : historyLogArray;
    historyList.innerHTML = '';

    if (list.length === 0) {
        historyList.innerHTML = `
            <li class="empty-state">
                <div class="empty-state-icon">📂</div>
                <h4>No History Records Found</h4>
                <p>Visit some websites using the URL bar or quick bookmarks above to populate the Array.</p>
            </li>
        `;
        return;
    }

    list.forEach((item, index) => {
        const details = parseUrlDetails(item.url);
        const isCurrentPage = sessionList.current && sessionList.current.url === item.url;

        const li = document.createElement('li');
        li.className = `history-item ${isCurrentPage ? 'is-current' : ''}`;
        
        li.innerHTML = `
            <div class="history-item-left" onclick="handleVisitWebsite('${escapeHtml(item.url)}')" style="cursor: pointer;" title="Click to visit this page">
                <div class="history-item-favicon">${details.icon}</div>
                <div class="history-item-details">
                    <div class="history-item-title-row">
                        <span class="history-item-title">${escapeHtml(item.title)}</span>
                        ${isCurrentPage ? '<span class="badge-current-pill">Active</span>' : ''}
                        ${index === 0 ? '<span class="badge" style="background:#238636;color:#fff;font-size:0.65rem;">Recent</span>' : ''}
                    </div>
                    <div class="history-item-url">${escapeHtml(item.url)}</div>
                    <div class="history-item-meta">
                        <span>🕒 ${escapeHtml(item.visitedAt || item.timestamp)}</span>
                        <span>• Array Index: [${index}]</span>
                    </div>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="action-icon-btn" onclick="handleVisitWebsite('${escapeHtml(item.url)}')" title="Visit page again">
                    &#10140;
                </button>
                <button class="action-icon-btn delete-btn" onclick="handleDeleteHistoryItem('${item.id}')" title="Delete from Array">
                    &times;
                </button>
            </div>
        `;

        historyList.appendChild(li);
    });
}

/**
 * Update the Badge count on the History Tab
 */
function updateCountBadge() {
    historyCountBadge.textContent = historyLogArray.length;
}

/**
 * Render the Live DSA Visualizer (Doubly Linked List chain + Array Memory cells)
 */
function renderVisualizer() {
    // 1. RENDER DOUBLY LINKED LIST
    const dllNodes = sessionList.toArray();
    linkedListVisualizer.innerHTML = '';

    if (dllNodes.length === 0) {
        linkedListVisualizer.innerHTML = `
            <div class="empty-state" style="padding:15px; width: 100%;">
                <p style="font-size:0.78rem; color:var(--text-muted);">
                    🔗 Linked List is currently empty (<code>head = null</code>). Visit a website to create the first Node.
                </p>
            </div>
        `;
    } else {
        dllNodes.forEach((node, idx) => {
            // Node box element
            const nodeEl = document.createElement('div');
            nodeEl.className = `node-box ${node.isCurrent ? 'current' : ''}`;
            nodeEl.innerHTML = `
                <div class="node-index">Node [${node.index}]</div>
                <div class="node-title">${escapeHtml(node.title)}</div>
                <div class="node-url">${escapeHtml(node.url.replace(/^https?:\/\//i, ''))}</div>
                <div class="node-pointer-indicator">
                    ${node.hasPrev ? '&larr; prev' : 'null'} | ${node.hasNext ? 'next &rarr;' : 'null'}
                </div>
            `;
            linkedListVisualizer.appendChild(nodeEl);

            // Double arrow separator between nodes
            if (idx < dllNodes.length - 1) {
                const arrowEl = document.createElement('div');
                arrowEl.className = 'dll-arrow';
                arrowEl.innerHTML = '&harr;'; // Bidirectional arrow
                linkedListVisualizer.appendChild(arrowEl);
            }
        });
    }

    // 2. RENDER ARRAY STORAGE VIEW
    arrayVisualizer.innerHTML = '';
    if (historyLogArray.length === 0) {
        arrayVisualizer.innerHTML = `
            <div class="empty-state" style="padding:15px; width: 100%;">
                <p style="font-size:0.78rem; color:var(--text-muted);">
                    📊 Array is empty (<code>historyLogArray.length = 0</code>).
                </p>
            </div>
        `;
    } else {
        // Show up to the first 10 items in the visualizer for readability
        const displayLimit = Math.min(historyLogArray.length, 10);
        for (let i = 0; i < displayLimit; i++) {
            const item = historyLogArray[i];
            const cellEl = document.createElement('div');
            cellEl.className = 'array-cell';
            cellEl.innerHTML = `
                <div class="array-cell-index">[${i}]</div>
                <div class="array-cell-value" title="${escapeHtml(item.url)}">
                    ${escapeHtml(item.title.substring(0, 10))}
                </div>
            `;
            arrayVisualizer.appendChild(cellEl);
        }

        if (historyLogArray.length > 10) {
            const moreEl = document.createElement('div');
            moreEl.className = 'array-cell';
            moreEl.innerHTML = `
                <div class="array-cell-index">[...]</div>
                <div class="array-cell-value">+${historyLogArray.length - 10} more</div>
            `;
            arrayVisualizer.appendChild(moreEl);
        }
    }
}


// ============================================================================
// PART 7: EVENT LISTENERS & USER INTERACTIONS
// ============================================================================

// Form submit event (URL bar / Visit button)
urlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value;
    if (url) {
        handleVisitWebsite(url);
    }
});

// Clear URL input field button
clearUrlInputBtn.addEventListener('click', () => {
    urlInput.value = '';
    urlInput.focus();
    clearUrlInputBtn.style.display = 'none';
});

urlInput.addEventListener('input', () => {
    clearUrlInputBtn.style.display = urlInput.value.length > 0 ? 'block' : 'none';
});

// Navigation buttons
backBtn.addEventListener('click', handleBackNavigation);
forwardBtn.addEventListener('click', handleForwardNavigation);
reloadBtn.addEventListener('click', handleReloadPage);
homeBtn.addEventListener('click', handleHomeNavigation);

// Clear All History Button
clearHistoryBtn.addEventListener('click', handleClearAllHistory);

// Quick Bookmark buttons
document.querySelectorAll('.bookmark-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const url = chip.getAttribute('data-url');
        if (url) {
            handleVisitWebsite(url);
        }
    });
});

// Search History (Real-time Linear Search on Array)
searchHistoryInput.addEventListener('input', (e) => {
    const query = e.target.value;
    clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';

    // Perform Linear Search over the Array
    const results = searchHistoryArray(query);

    if (query.trim()) {
        searchResultInfo.classList.remove('hidden');
        searchResultInfo.innerHTML = `
            <span>Search Results for "<strong>${escapeHtml(query)}</strong>"</span>
            <span>${results.length} found (Linear Search: O(N))</span>
        `;
    } else {
        searchResultInfo.classList.add('hidden');
    }

    renderHistoryList(results);
});

// Clear Search input button
clearSearchBtn.addEventListener('click', () => {
    searchHistoryInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResultInfo.classList.add('hidden');
    renderHistoryList();
});

// Side Panel Tabs Switcher
sidePanelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetPaneId = tab.getAttribute('data-target');

        // Update active tab buttons
        sidePanelTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active pane
        tabPanes.forEach(pane => {
            if (pane.id === targetPaneId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    });
});

// Refresh Visualizer Button
if (refreshVisualizerBtn) {
    refreshVisualizerBtn.addEventListener('click', () => {
        renderVisualizer();
        showToast('🔄 Live DSA Inspector updated!');
    });
}

// Toggle Side Panel button on global header
if (toggleDsaPanelBtn) {
    toggleDsaPanelBtn.addEventListener('click', () => {
        // Activate the Visualizer tab on the side panel
        const visualizerTab = document.getElementById('tabVisualizerBtn');
        if (visualizerTab) {
            visualizerTab.click();
        }
    });
}

// Keyboard shortcuts for realistic browser experience:
// Alt + LeftArrow = Back, Alt + RightArrow = Forward
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBackNavigation();
    } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleForwardNavigation();
    }
});


// ============================================================================
// PART 8: UTILITY & HELPER FUNCTIONS
// ============================================================================

/**
 * Escape HTML to prevent XSS in dynamic rendering
 * @param {string} str - Input text
 * @returns {string} Sanitized string
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Toast notification system for user feedback
 * @param {string} message - Feedback message
 */
let toastTimeout = null;
function showToast(message) {
    if (!toastNotification) return;

    toastNotification.textContent = message;
    toastNotification.classList.remove('hidden');

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toastNotification.classList.add('hidden');
    }, 2800);
}


// ============================================================================
// PART 9: INITIALIZATION
// ============================================================================

// Initialize default view on page load
document.addEventListener('DOMContentLoaded', () => {
    // Render initial state
    renderHomePage();
    renderHistoryList();
    renderVisualizer();
    updateNavigationControls();
    updateCountBadge();

    // Automatically load Google as the starting demo site for immediate presentation
    setTimeout(() => {
        handleVisitWebsite('https://google.com');
    }, 400);
});
