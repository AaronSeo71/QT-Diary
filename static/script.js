let entries = [];

// Function to fetch all entries
function fetchEntries() {
    fetch('/entries')
        .then(response => response.json())
        .then(data => {
            entries = data;
            renderEntries();
        });
}

// Function to save a diary entry
function saveEntry() {
    const entry = {
        dateTime: document.getElementById('dateTime').value,
        bibleVerse: document.getElementById('bibleVerse').value,
        summary: document.getElementById('summary').value,
        sin: document.getElementById('sin').value,
        promise: document.getElementById('promise').value,
        example: document.getElementById('example').value,
        command: document.getElementById('command').value,
        knowledge: document.getElementById('knowledge').value,
        conversation: document.getElementById('conversation').value,
        sharing: document.getElementById('sharing').value,
    };

    if (entry.dateTime && entry.bibleVerse && entry.summary) {
        fetch('/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById('inputForm').reset();
            fetchEntries();
        });
    } else {
        alert('날짜/시간, 성경본문, 말씀요약을 입력하세요.');
    }
}

// Function to render diary entries
function renderEntries(entriesToRender = entries) {
    const dataListDiv = document.getElementById('dataList');
    dataListDiv.innerHTML = '';
    entriesToRender.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.innerHTML = `
            <span><strong>${entry.dateTime}</strong></span>
            <span><strong>성경본문:</strong> ${entry.bibleVerse}</span>
            <span><strong>말씀요약:</strong> ${entry.summary}</span>
            <span><strong>죄:</strong> ${entry.sin}</span>
            <span><strong>약속:</strong> ${entry.promise}</span>
            <span><strong>모범:</strong> ${entry.example}</span>
            <span><strong>명령:</strong> ${entry.command}</span>
            <span><strong>지식:</strong> ${entry.knowledge}</span>
            <span><strong>대화:</strong> ${entry.conversation}</span>
            <span><strong>나눔:</strong> ${entry.sharing}</span>
            <button onclick="editEntry(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delete</button>
        `;
        dataListDiv.appendChild(entryDiv);
    });
}

// Function to delete a diary entry
function deleteEntry(index) {
    fetch(`/entries/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        fetchEntries();
    });
}

// Function to edit a diary entry
function editEntry(index) {
    const entry = entries[index];
    const newContent = {
        dateTime: prompt('Edit 날짜/시간:', entry.dateTime),
        bibleVerse: prompt('Edit 성경본문:', entry.bibleVerse),
        summary: prompt('Edit 말씀요약:', entry.summary),
        sin: prompt('Edit 죄:', entry.sin),
        promise: prompt('Edit 약속:', entry.promise),
        example: prompt('Edit 모범:', entry.example),
        command: prompt('Edit 명령:', entry.command),
        knowledge: prompt('Edit 지식:', entry.knowledge),
        conversation: prompt('Edit 대화:', entry.conversation),
        sharing: prompt('Edit 나눔:', entry.sharing),
    };

    if (newContent.dateTime && newContent.bibleVerse && newContent.summary) {
        fetch(`/entries/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newContent)
        })
        .then(response => response.json())
        .then(() => {
            fetchEntries();
        });
    } else {
        alert('날짜/시간, 성경본문, 말씀요약을 입력하세요.');
    }
}

// Function to export diary entries
function exportEntries() {
    window.location.href = '/export';
}

// Function to import diary entries
function importEntries(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch('/import', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => {
            fetchEntries();
        });
    }
}

// Function to clear all diary entries
function clearAllEntries() {
    if (confirm('Are you sure you want to clear all entries?')) {
        fetch('/clear', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            fetchEntries();
        });
    }
}

// Function to show the entry form
function showEntryForm() {
    document.getElementById('inputForm').style.display = 'block';
    document.getElementById('searchForm').style.display = 'none';
    document.getElementById('dataList').style.display = 'none';
}

// Function to show the entry list
function showEntryList() {
    document.getElementById('inputForm').style.display = 'none';
    document.getElementById('searchForm').style.display = 'block';
    document.getElementById('dataList').style.display = 'block';
    fetchEntries();
}

// Function to search entries
function searchEntries() {
    const searchTerm = document.getElementById('searchField').value.toLowerCase();
    const filteredEntries = entries.filter(entry => 
        entry.dateTime.toLowerCase().includes(searchTerm) ||
        entry.bibleVerse.toLowerCase().includes(searchTerm) ||
        entry.summary.toLowerCase().includes(searchTerm) ||
        entry.sin.toLowerCase().includes(searchTerm) ||
        entry.promise.toLowerCase().includes(searchTerm) ||
        entry.example.toLowerCase().includes(searchTerm) ||
        entry.command.toLowerCase().includes(searchTerm) ||
        entry.knowledge.toLowerCase().includes(searchTerm) ||
        entry.conversation.toLowerCase().includes(searchTerm) ||
        entry.sharing.toLowerCase().includes(searchTerm)
    );
    renderEntries(filteredEntries);
}

// Initial render
showEntryForm();
