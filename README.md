# 🌐 Browser History Manager - DSA Mini-Project

A college-level Data Structures and Algorithms (DSA) mini-project built with pure **HTML**, **CSS**, and **JavaScript** for 2nd-year B.Tech / B.E. / BCA / MCA students.

This project simulates a modern web browser's history and navigation engine to clearly demonstrate the practical real-world application of **Doubly Linked Lists** and **Arrays**.

---

## 📌 Project Objective

The primary objective of this project is to bridge theoretical Data Structures concepts with real-world software engineering. By constructing a browser interface, students learn:
1. Why web browsers utilize **Doubly Linked Lists** for instantaneous backward and forward session navigation.
2. How **Arrays** are employed for sequential history logging, chronological display, and linear search.
3. How pointer manipulation works under the hood when history branches are pruned upon visiting a new website.

---

## 🎯 Problem Statement

Modern web browsers like Chrome, Firefox, and Safari allow users to:
- Visit web pages sequentially.
- Click **Back** to view previously visited pages.
- Click **Forward** to re-traverse pages previously backed out of.
- Search and clear all historical visits.

If a naive array or singly linked list were used alone for Back/Forward navigation:
- Moving backward would require expensive index shifting or $O(N)$ pointer traversals.
- Moving forward after branching requires tricky index tracking.

**Solution:** By pairing a **Doubly Linked List** (for active bidirectional session navigation) with an **Array** (for the full historical log and search), we achieve optimal $O(1)$ navigation operations and a structured $O(N)$ search mechanism.

---

## ✨ Features

1. **Visit Website:**
   - User inputs any web URL (or picks from quick bookmarks like Google, GitHub, Wikipedia, etc.).
   - Adds the new page to both the active Linked List session and the History Array.
   - Dynamically updates the browser viewport with status code, protocol, response time, and website preview.

2. **Back Button ($\leftarrow$):**
   - Moves one step backward through previously visited pages in $O(1)$ time.
   - Implemented via Linked List pointer movement (`current = current.prev`).
   - Automatically disabled when at the start of history (`current.prev == null`).

3. **Forward Button ($\rightarrow$):**
   - Moves one step forward through visited pages in $O(1)$ time.
   - Implemented via Linked List pointer movement (`current = current.next`).
   - Automatically disabled when at the newest page (`current.next == null`).

4. **Branching History Invalidation (Real Browser Behavior):**
   - If a user clicks Back multiple times and then visits a *new* website, all forward history nodes ahead of `current` are pruned/truncated (`current.next = null`).

5. **History Log (Array):**
   - Displays all visited pages chronologically (newest at the top using `unshift`).
   - Shows timestamp, URL, domain title, and array index `[0, 1, 2, ...]`.
   - Allows individual entry deletion (`splice`).

6. **Search History (Linear Search):**
   - Real-time search through the history Array.
   - Case-insensitive string matching over URLs and website titles.
   - Displays the number of matched results and algorithmic complexity.

7. **Clear History:**
   - Completely flushes the history Array (`array = []`) and resets the Doubly Linked List pointers to `null`.

8. **Live DSA Visualizer Panel:**
   - Interactive visual inspection showing:
     - **Linked List Node Chain:** Visual node boxes connected by bidirectional arrows ($\leftrightarrow$), with the active page highlighted with a glowing border and `[CURRENT]` badge.
     - **Array Memory View:** Visual representation of array index cells `[0], [1], [2]...`.

9. **Viva Voce Study Notes Tab:**
   - Built-in questions and answers directly inside the application UI for quick revision during college exams.

---

## 🧩 Data Structures and Algorithms (DSA) Used

### 1. Doubly Linked List

```
[Node: Google] <---> [Node: Wikipedia] <---> [Node: GitHub (CURRENT)]
  prev: null            prev: Google           prev: Wikipedia
  next: Wikipedia       next: GitHub           next: null
```

#### Why Doubly Linked List?
- **Bidirectional Traversal:** Each node contains both a `prev` pointer and a `next` pointer.
- **$O(1)$ Constant Time Navigation:**
  - Back action: `current = current.prev` $\rightarrow O(1)$
  - Forward action: `current = current.next` $\rightarrow O(1)$
  - Insert new page: `current.next = newNode; newNode.prev = current; current = newNode;` $\rightarrow O(1)$
- **Dynamic Size:** Memory is allocated dynamically on each visit without fixed capacity constraints.

#### Code Architecture:
- `HistoryNode`: Class containing `url`, `title`, `timestamp`, `prev`, and `next`.
- `DoublyLinkedList`: Class containing `head`, `tail`, `current`, `size`, and methods `visit()`, `goBack()`, `goForward()`, `hasPrev()`, `hasNext()`, `clear()`.

---

### 2. Array

```
Index:    [0]                 [1]                 [2]
Value: { url: "github.com" }, { url: "wiki.org" }, { url: "google.com" }
```

#### Why Array?
- **Sequential Storage:** Preserves chronological order of visits.
- **Index-Based Access:** Allows accessing any recorded history item directly via index.
- **Traversability:** Enables iterating over elements for Linear Search and filtering.

#### Operations on Array:
- **Insertion (Prepend):** `historyLogArray.unshift(item)` puts the newest item at index `0`.
- **Deletion:** `historyLogArray.splice(index, 1)` deletes an individual history entry.
- **Linear Search Algorithm:**
  ```javascript
  for (let i = 0; i < historyLogArray.length; i++) {
      if (historyLogArray[i].url.includes(query) || historyLogArray[i].title.includes(query)) {
          results.push(historyLogArray[i]);
      }
  }
  ```
  - **Time Complexity:** $O(N)$
  - **Space Complexity:** $O(K)$ where $K$ is the number of matching items.

---

## 📊 Time & Space Complexity Summary

| Feature / Operation | Data Structure Used | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Visit New Website** | Doubly Linked List (Append) | $O(1)$ | $O(1)$ per node |
| **Add to History Log** | Array (`unshift`) | $O(N)$ shift / $O(1)$ append | $O(1)$ per entry |
| **Back Navigation** | Doubly Linked List (`current.prev`) | **$O(1)$** | $O(1)$ |
| **Forward Navigation**| Doubly Linked List (`current.next`)| **$O(1)$** | $O(1)$ |
| **Search History** | Array (Linear Search) | **$O(N)$** | $O(K)$ results |
| **Delete History Item**| Array (`splice`) | $O(N)$ | $O(1)$ |
| **Clear All History** | Array & Linked List | $O(1)$ | $O(1)$ |

---

## 🛠️ Technologies Used

- **HTML5:** Semantic markup, window chrome structure, accessibility labels.
- **CSS3:** Custom properties (CSS variables), Flexbox, CSS Grid, responsive design, animations.
- **JavaScript (ES6+):** Pure Vanilla JavaScript with OOP classes (`HistoryNode`, `DoublyLinkedList`), DOM manipulation, and linear search.
- **No external frameworks or libraries:** 100% self-contained without React, Vue, jQuery, Bootstrap, or Node.js.

---

## 📂 File Structure

```
Browser history manager/
│
├── index.html        # Main HTML structure (Browser window, Address bar, Side Panel)
├── style.css         # Modern dark-mode styling, responsive layout, visualizer styles
├── script.js         # Doubly Linked List, Array logic, Linear Search & UI Controller
└── README.md         # Complete project documentation and Viva Voce guide
```

---

## 🚀 How to Run the Project

1. **Option 1: Direct Browser Launch**
   - Navigate to the project folder:
     `c:\Users\ASUS\OneDrive\Desktop\Browser history manager`
   - Double-click `index.html` (or right-click $\rightarrow$ **Open with** $\rightarrow$ Google Chrome / Microsoft Edge / Firefox).

2. **Option 2: VS Code Live Server (Optional)**
   - Open the folder in VS Code.
   - Right-click `index.html` and select **Open with Live Server**.

---

## 🎓 College Viva Voce Questions & Answers

### Q1: Why did you choose a Doubly Linked List instead of a Singly Linked List for navigation?
**Answer:** In a Singly Linked List, nodes only point to `next`. When the user clicks the "Back" button, finding the previous node would require traversing all the way from `head` to `current`, taking $O(N)$ time. A Doubly Linked List stores a `prev` pointer in every node, allowing instantaneous $O(1)$ backward movement.

### Q2: What happens when a user clicks Back twice and then visits a new website?
**Answer:** The browser branches off into a new navigation path. In our `DoublyLinkedList.visit()` method, we truncate/detach any forward nodes ahead of `current` by executing:
```javascript
this.current.next = null;
this.tail = this.current;
```
The new node is then linked to `this.current.next`. The previously forward nodes are automatically cleaned up by garbage collection.

### Q3: Why is an Array used alongside the Linked List?
**Answer:** The Doubly Linked List represents the *active session path* (which can be truncated when branching). The Array, on the other hand, acts as the *permanent historical log* of every visit in chronological order. Arrays also provide indexed storage, making them suitable for iterating and performing linear search.

### Q4: How is Search History implemented and what is its complexity?
**Answer:** It uses the **Linear Search** algorithm. It iterates through the history Array from index `0` to `length - 1`, checking if the user's query is a substring of the `url` or `title`. The time complexity is $O(N)$ where $N$ is the number of visited sites.

### Q5: Can Stack be used for Browser History?
**Answer:** Yes, browser navigation can also be implemented using **two Stacks**:
- `backStack`: stores pages to go back to.
- `forwardStack`: stores pages to go forward to.
However, a Doubly Linked List is a more unified, pointer-based data structure that naturally represents the linear timeline with a single sliding pointer (`current`).

---

## 🔮 Future Scope

1. **Local Storage Persistence:** Store the History Array in browser `localStorage` to retain history across page refreshes.
2. **Frequency Counter / Hash Map:** Add a Hash Map (`URL -> Visit Count`) to display "Most Visited Websites".
3. **Bookmarks Tree (Trie Data Structure):** Implement a Trie for URL autocompletion in the address bar.
4. **Time Filter:** Filter history by Date (e.g., Today, Yesterday, Last 7 days).

---

## 🏁 Conclusion

The **Browser History Manager** project successfully demonstrates how fundamental data structures—namely **Doubly Linked Lists** and **Arrays**—serve as the building blocks for modern software like web browsers. The project meets all academic requirements, remains beginner-friendly, and offers an intuitive visual representation for college evaluations.
