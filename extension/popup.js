document.getElementById('generate').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        const results = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => document.body.innerText
        });

        if (!results || !results[0] || !results[0].result) {
            throw new Error('Could not get page content');
        }

        const pageContent = results[0].result;
        const prompt = `Summarize this webpage content:\n\n${pageContent}`;

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
        } else {
            throw new Error('Unexpected response format from API');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error: ' +
            (error.message || 'Failed to generate summary');
    }
});