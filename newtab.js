document.addEventListener('DOMContentLoaded', function() {
  var editor = document.getElementById('editor');
  var lineNumbers = document.getElementById('line-numbers');
  var saveButton = document.getElementById('save-button');

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
});
