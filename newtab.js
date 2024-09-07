document.addEventListener('DOMContentLoaded', function() {
  var editor = document.getElementById('editor');
  var lineNumbers = document.getElementById('line-numbers');
  var saveButton = document.getElementById('save-button');

    // Tabs
    var editorTab = document.getElementById('tab-editor');
    var epochTab = document.getElementById('tab-epoch');
    var diffTab = document.getElementById('tab-diff');
    var beautifyTab = document.getElementById('tab-beautify');
    var aboutTab = document.getElementById('tab-about');
    
    var editorContainer = document.getElementById('editor-container');
    var epochContainer = document.getElementById('settings-container');
    var diffContainer = document.getElementById('diff-container');
    var beautifyContainer = document.getElementById('beautify-container');
    var aboutContainer = document.getElementById('about-container');
  
    function switchTab(activeTab, activeContainer) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.content-pane').forEach(pane => pane.style.display = 'none');
      
      activeTab.classList.add('active');
      activeContainer.style.display = 'block';
    }
  
    editorTab.addEventListener('click', function() {
      switchTab(editorTab, editorContainer);
    });
  
    epochTab.addEventListener('click', function() {
      switchTab(epochTab, epochContainer);
    });
  
    diffTab.addEventListener('click', function() {
      switchTab(diffTab, diffContainer);
    });

    beautifyTab.addEventListener('click', function() {
      switchTab(beautifyTab, beautifyContainer);
    });

    aboutTab.addEventListener('click', function() {
      switchTab(aboutTab, aboutContainer);
    });

  // Function to update line numbers
  function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = '';
    for (let i = 1; i <= lines; i++) {
      const lineElement = document.createElement('div');
      lineElement.textContent = i;
      lineElement.style.lineHeight = window.getComputedStyle(editor).lineHeight; // Match line height
      lineNumbers.appendChild(lineElement);
    }
  }

  // Function to handle paste event and scroll the editor
  function handlePaste(event) {
    event.preventDefault();
    let pasteData = (event.clipboardData || window.clipboardData).getData('text');
    let formattedPasteData = pasteData; // Add formatting logic if needed

    // Insert formatted content at the cursor position
    let cursorPosition = editor.selectionStart;
    let textBefore = editor.value.substring(0, cursorPosition);
    let textAfter = editor.value.substring(editor.selectionEnd, editor.value.length);
    editor.value = textBefore + formattedPasteData + textAfter;
    editor.selectionStart = editor.selectionEnd = cursorPosition + formattedPasteData.length;

    // Update line numbers
    updateLineNumbers();

    // Scroll to the position where the cursor is at the bottom of the viewport
    const lineHeight = parseInt(window.getComputedStyle(editor).lineHeight, 10);
    const cursorLine = (editor.value.substring(0, editor.selectionStart).match(/\n/g) || []).length;
    const editorHeight = editor.clientHeight;
    editor.scrollTop = cursorLine * lineHeight - editorHeight + lineHeight;
  }

  // Function to save the content as a text file
  function saveContent() {
    const blob = new Blob([editor.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Initial setup
  updateLineNumbers();

  // Update line numbers on input
  editor.addEventListener('input', updateLineNumbers);

  // Handle paste event
  editor.addEventListener('paste', handlePaste);

  // Save content when the button is clicked
  saveButton.addEventListener('click', saveContent);

  // Sync scroll position between editor and line numbers
  editor.addEventListener('scroll', function() {
    lineNumbers.scrollTop = editor.scrollTop;
  });

  // Load saved content
  chrome.storage.local.get(['editorContent'], function(result) {
    if (result.editorContent) {
      editor.value = result.editorContent;
      updateLineNumbers();
    }
  });

  // Save content on input
  editor.addEventListener('input', function() {
    chrome.storage.local.set({ editorContent: editor.value });
  });

  // Function to convert Epoch to DateTime
function convertToDateTime() {
  const epochInput = document.getElementById('epoch-input').value;
  const date = new Date(parseInt(epochInput) * 1000);
  document.getElementById('epoch-output').innerText = date.toString();
}

// Function to convert DateTime to Epoch
function convertToEpoch() {
  const datetimeInput = document.getElementById('datetime-input').value;
  const date = new Date(datetimeInput);
  const epoch = Math.floor(date.getTime() / 1000);
  document.getElementById('datetime-output').innerText = epoch;
}
});


