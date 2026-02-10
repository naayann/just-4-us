// Global JavaScript for the Valentine's Day website
// Page-specific logic is initialized based on body class

document.addEventListener('DOMContentLoaded', () => {
  const pageClass = document.body.className;

  // Common functions
  function getQueryParams() {
    return new URLSearchParams(window.location.search);
  }

  function encodeData(data) {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  }

  function decodeData(encoded) {
    try {
      return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch (e) {
      return null;
    }
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  function redirectToShare(type, data) {
    const encoded = encodeData(data);
    window.location.href = `share.html?type=${type}&data=${encoded}`;
  }

  // Landing Page: No specific JS needed beyond CSS interactions

  // Choose Page: No specific JS, just links

  // Love Letter Generator
  if (pageClass.includes('letter-page')) {
    const form = document.getElementById('letter-form');
    const output = document.getElementById('letter-output');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const tone = document.getElementById('tone').value;

      // Simple template-based generation
      let template = '';
      if (tone === 'romantic') {
        template = `Dear ${name},\n\nIn the quiet moments, I find myself lost in thoughts of you. Your smile lights up my world like the stars in the night sky. Every day with you is a beautiful adventure.\n\nWith all my love,`;
      } else if (tone === 'playful') {
        template = `Hey ${name},\n\nYou're the peanut butter to my jelly! Life's more fun with you around. Let's keep making silly memories together.\n\nHugs and giggles,`;
      } else if (tone === 'emotional') {
        template = `My dearest ${name},\n\nYou've touched my heart in ways I never imagined. Through ups and downs, your presence gives me strength. I'm grateful for every moment.\n\nForever yours,`;
      }

      output.textContent = template;
      output.style.display = 'block';

      // Enable share
      document.getElementById('share-btn').disabled = false;
      document.getElementById('share-btn').addEventListener('click', () => {
        redirectToShare('letter', { text: template });
      });
    });
  }

  // Memory Timeline
  if (pageClass.includes('timeline-page')) {
    const form = document.getElementById('timeline-form');
    const timelineContainer = document.getElementById('timeline-container');
    let milestones = [];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('date').value;
      const desc = document.getElementById('desc').value;

      milestones.push({ date, desc });
      renderTimeline();

      form.reset();
    });

    function renderTimeline() {
      timelineContainer.innerHTML = '';
      milestones.forEach((milestone, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `<h3>${milestone.date}</h3><p>${milestone.desc}</p>`;
        timelineContainer.appendChild(item);
      });

      // Enable share if milestones exist
      if (milestones.length > 0) {
        document.getElementById('share-btn').disabled = false;
        document.getElementById('share-btn').addEventListener('click', () => {
          redirectToShare('timeline', { milestones });
        });
      }
    }
  }

  // Partner Quiz
  if (pageClass.includes('quiz-page')) {
    const form = document.getElementById('quiz-builder-form');
    const questionsContainer = document.getElementById('questions-container');
    let questions = [];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = document.getElementById('question').value;
      const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
      ];
      const correct = document.getElementById('correct').value - 1; // 0-based index

      questions.push({ question, options, correct });
      renderQuestionsPreview();

      form.reset();
    });

    function renderQuestionsPreview() {
      questionsContainer.innerHTML = '';
      questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>Question ${index + 1}: ${q.question}</h3><ul>${q.options.map(opt => `<li>${opt}</li>`).join('')}</ul><p>Correct: ${q.options[q.correct]}</p>`;
        questionsContainer.appendChild(div);
      });

      if (questions.length > 0) {
        document.getElementById('share-btn').disabled = false;
        document.getElementById('share-btn').addEventListener('click', () => {
          redirectToShare('quiz', { questions });
        });
      }
    }
  }

  // Surprise Reveal
  if (pageClass.includes('reveal-page')) {
    const form = document.getElementById('reveal-form');
    const output = document.getElementById('reveal-output');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = document.getElementById('message').value;

      output.textContent = message;
      output.style.display = 'block';

      document.getElementById('share-btn').disabled = false;
      document.getElementById('share-btn').addEventListener('click', () => {
        redirectToShare('reveal', { message });
      });
    });
  }

  // Share Page
  if (pageClass.includes('share-page')) {
    const params = getQueryParams();
    const type = params.get('type');
    const data = decodeData(params.get('data'));
    const preview = document.getElementById('preview');
    const copyBtn = document.getElementById('copy-btn');

    if (!type || !data) {
      preview.innerHTML = '<p>Error: No content to display.</p>';
      return;
    }

    switch (type) {
      case 'letter':
        preview.innerHTML = `<pre>${data.text}</pre>`;
        break;
      case 'timeline':
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        data.milestones.forEach((m, index) => {
          const item = document.createElement('div');
          item.className = 'timeline-item';
          item.innerHTML = `<h3>${m.date}</h3><p>${m.desc}</p>`;
          timeline.appendChild(item);
        });
        preview.appendChild(timeline);
        break;
      case 'quiz':
        const quizForm = document.createElement('form');
        quizForm.id = 'quiz-form';
        data.questions.forEach((q, index) => {
          const div = document.createElement('div');
          div.className = 'quiz-question';
          div.innerHTML = `<h3>${q.question}</h3>`;
          q.options.forEach((opt, optIndex) => {
            div.innerHTML += `<label><input type="radio" name="q${index}" value="${optIndex}"> ${opt}</label>`;
          });
          quizForm.appendChild(div);
        });
        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn';
        submitBtn.textContent = 'Submit Quiz';
        submitBtn.type = 'button';
        quizForm.appendChild(submitBtn);
        const scoreDiv = document.createElement('div');
        scoreDiv.id = 'score';
        preview.appendChild(quizForm);
        preview.appendChild(scoreDiv);

        submitBtn.addEventListener('click', () => {
          let score = 0;
          data.questions.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
              score++;
            }
          });
          scoreDiv.innerHTML = `<p>Your score: ${score} / ${data.questions.length}</p>`;
          scoreDiv.style.animation = 'fadeIn 0.5s ease-in-out';
          scoreDiv.querySelector('p').style.color =
            score === 0 ? 'red' : score > 1 ? 'green' : 'green';
          
          if (score > 0) {
            triggerConfetti();
          }
        });
        break;
      case 'reveal':
        const revealBtn = document.createElement('button');
        revealBtn.className = 'btn btn-celebrate'; // Add celebratory styling
        revealBtn.textContent = 'Reveal Surprise';
        const messageDiv = document.createElement('div');
        messageDiv.style.display = 'none';
        messageDiv.innerHTML = `<p>${data.message}</p>`;
        preview.appendChild(revealBtn);
        preview.appendChild(messageDiv);

        revealBtn.addEventListener('click', () => {
          // Trigger confetti explosion
          triggerConfetti();

          messageDiv.style.display = 'block';
          messageDiv.style.animation = 'fadeIn 1s ease-in-out';
          revealBtn.style.display = 'none';
        });
        break;
    }

    // Copy Link
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    });
  }
});