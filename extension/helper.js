document.getElementById('settings-toggle').addEventListener('click', function () {

    const settingsPanel = document.getElementById('settings-panel');
    settingsPanel.classList.toggle('visible');
});

document.getElementById('length-slider').addEventListener('input', function () {
    document.getElementById('length-value').textContent = this.value;
});


document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        this.classList.add('active');

        const tabId = this.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
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

document.getElementById('clear-btn').addEventListener('click', function () {
    document.getElementById('result').textContent = '';
    document.getElementById('keywords-result').textContent = '';
    document.getElementById('word-counter').textContent = '';
    document.getElementById('error').textContent = '';
});

document.getElementById('generate').addEventListener('click', function () {
    const lengthValue = document.getElementById('length-slider').value;
    const styleValue = document.getElementById('style-select').value;

    document.getElementById('loader').style.display = 'block';
    document.getElementById('result').textContent = '';
    document.getElementById('keywords-result').textContent = '';
    document.getElementById('error').textContent = '';

    // Simulate API call delay
    setTimeout(() => {
        // Hide loader
        document.getElementById('loader').style.display = 'none';

        // Sample result based on selected options
        let resultText;
        let keywords;

        switch (styleValue) {
            case 'concise':
                resultText = "This page discusses machine learning applications in healthcare, focusing on early disease detection and treatment optimization. Key advancements include AI models for medical imaging analysis and predictive analytics for patient outcomes.";
                break;
            case 'detailed':
                resultText = "This article explores the growing implementation of machine learning technologies in healthcare settings, with particular emphasis on early disease detection protocols and optimization of treatment pathways. Recent research demonstrates significant improvements in diagnostic accuracy when AI models are applied to medical imaging analysis, with some studies reporting detection rates exceeding human specialists by 12-18%. The paper also discusses how predictive analytics are being used to forecast patient outcomes and customize treatment plans, potentially reducing hospital readmission rates by up to 30% in pilot programs. Challenges regarding data privacy, algorithmic bias, and clinical integration are acknowledged as areas requiring further research and policy development.";
                break;
            case 'bullet':
                resultText = "• Machine learning applications in healthcare are expanding rapidly\n• AI models show superior performance in medical imaging analysis\n• Detection rates exceed human specialists by 12-18% in some studies\n• Predictive analytics help customize treatment plans\n• Hospital readmission rates reduced by up to 30% in pilot programs\n• Data privacy and algorithmic bias remain significant challenges";
                break;
            case 'eli5':
                resultText = "Imagine doctors getting special computer helpers that are really good at spotting things in pictures that might mean someone is sick. These computer helpers have looked at millions of pictures of sick and healthy people, so they're super good at noticing tiny differences that even doctors might miss sometimes. They're also like weather forecasters for your health - they can guess what might happen to you based on what happened to lots of other people who were similar to you. This helps doctors pick the best medicine or treatment for you specifically, instead of just giving everyone the same thing.";
                break;
        }

        // Adjust length based on slider value
        if (lengthValue < 3) {
            resultText = resultText.split('. ').slice(0, lengthValue + 1).join('. ') + '.';
        } else if (lengthValue > 3) {
            // Add more content for longer summaries
            resultText += " Furthermore, integration of electronic health records with machine learning models has shown promise in identifying at-risk populations before symptoms manifest. Ethical considerations regarding patient consent and data ownership continue to shape regulatory frameworks worldwide.";
        }

        // Generate keywords based on the content
        keywords = ['Machine Learning', 'Healthcare', 'AI Diagnostics', 'Predictive Analytics', 'Medical Imaging', 'Patient Outcomes', 'Treatment Optimization'];

        // Display results
        document.getElementById('result').textContent = resultText;

        // Display keywords as tags
        document.getElementById('keywords-result').innerHTML = keywords.map(keyword =>
            `<span style="display: inline-block; background: #e8f0fe; color: #1967d2; padding: 6px 10px; border-radius: 16px; margin: 4px; font-size: 13px;">${keyword}</span>`
        ).join('');

        // Update word counter
        const wordCount = resultText.split(/\s+/).filter(word => word.length > 0).length;
        document.getElementById('word-counter').textContent = `${wordCount} words`;

    }, 2000);
});
