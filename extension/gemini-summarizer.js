document.getElementById('settings-toggle').addEventListener('click', function () {

    const settingsPanel = document.getElementById('settings-panel');
    settingsPanel.classList.toggle('visible');
});

document.getElementById('length-slider').addEventListener('input', function () {
    document.getElementById('length-value').textContent = this.value;
});


document.getElementById('copy-btn').addEventListener('click', function () {
    const resultText = document.getElementById('result').textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="material-icons copy-btn-icon">check</span>Copied!';
        this.style.backgroundColor = '#e6f4ea';
        this.style.color = '#137333';

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '';
            this.style.color = '';
        }, 2000);
    });
});


document.getElementById('generate').addEventListener('click', async () => {
    try {

        let summary_length = document.getElementById('length-slider').value
        let style = document.getElementById('style-select').value;

        console.log(summary_length);

        document.getElementById('loader').style.display = 'block';
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        const results = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => document.body.innerText
        });

        if (!results || !results[0] || !results[0].result) {
            throw new Error('Could not get page content');
        }

        const pageContent = results[0].result;
        const prompt = `Summarize this webpage content in ${summary_length * 3} lines. In ${style} style!:\n\n${pageContent}`;

        const response = await fetch('http://localhost:8080/api/gemini/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: prompt
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const responseData = await response.json();

        if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
            document.getElementById('result').textContent =
                responseData.candidates[0].content.parts[0].text;

            document.getElementById("loader").style.display = 'none'
        } else {
            throw new Error('Unexpected response format from API');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error: ' +
            (error.message || 'Failed to generate summary');
    }
});


document.getElementById("clear-btn").addEventListener('click', function () {
    document.getElementById("result").textContent = '';
})