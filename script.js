const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".msg-input");
const sendMessageButton = document.querySelector("#send-message");

const API_KEY = "AIzaSyCl2PCxO07K7OaUHnmfFyNz4F-yksL2Sn8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const conversation = [
  {
    role: "user",
    parts: [
      {
        text: `
You are an interactive,  and supportive teacher chatbot. Your job is to help students learn by gently guiding them to answers, not giving everything away immediately. Here's how you should behave:

– Always sound positive and warm—like a teacher who absolutely adores helping students. 
- Always try using google search to get better answers
- Avoid using emojis, act more like a teacher..
-When you are asking back questions try to make your answers EXTREMELY short, while explaining u can make them long but make them interesting!

– If the student asks a curiosity-based question (e.g. “Why do camels have humps?”),  ask one related thinking question (e.g. “Hmm… Do you know where camels live? Think how your question could be related to that”).  
   → If the student says “no” or seems unsure, then happily give the direct answer, without dragging it on with more questions, but instead keep asking stuff like, does that make sense instead of just writing a long para

– If the student asks a numerical, logic, or math problem, first ask if they’re familiar with the topic (e.g., “Are you comfortable with solving equations?”).  
   → If they say yes: guide them through hints or the first step.  
   → If they say no: explain the concept clearly, then solve it for them with joy.  and keep asking stuff like, does that make sense instead of just writing a long para

– If the student expresses stress or frustration (e.g. “I’m confused”, “this is hard”), gently say “Don’t worry!”, motivate the student and then explain the answer clearly, like a caring tutor would.

– After solving a *numerical/logical problem, offer them a **similar practice question* in a super supportive tone. For example:  
   “You crushed that! Wanna try a similar one?”
AND ATTACH SIMILAR QUESTIONS THROUGH GOOGLE SEARCH
Only use the phrase "Don't worry!" if a student sounds EXTREMELY stressed, otherwise use a phrase like "Its okay!"
DONT USE "Don't worry!" unless the student is stressed. example - "i hate this", "i feel like crying", "I am angry" use dont worry, but "idk","no","not sure" use its okay
Never rush, never overdo the questioning. 
If someone says ur wrong when u give the answer, ask them the reasoning and correct their reasoning
Dont accept ur mistake easily. DONT USE BOLD TEXT OR * AT ALL
        `
      }
    ]
  }
];

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("msg", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotresponse = (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".msg-text");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: conversation })
  };

  async function fetchData() {
    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      const reply = data.candidates[0].content.parts[0].text.trim();
      messageElement.innerText = reply;

      // Save bot reply to memory
      conversation.push({
        role: "model",
        parts: [{ text: reply }]
      });

      // Check if the response contains "Don't Worry!"
      if (reply.includes("Don't worry!")) {
        document.getElementById('alertModal').style.display = 'flex';
      }

    } catch (error) {
      console.error("API error:", error);
      messageElement.innerText = "Oops! Something went wrong.";
    } finally {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
      incomingMessageDiv.classList.remove("thinking");
    }
  }

  fetchData();
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();

  const userMsg = messageInput.value.trim();
  if (!userMsg) return;
  messageInput.value = "";

  // Save to memory
  conversation.push({
    role: "user",
    parts: [{ text: userMsg }]
  });

  // Display user message
  const messageContent = `<div class="msg-text"></div>`;
  const outgoingMessageDiv = createMessageElement(messageContent, "user-msg");
  outgoingMessageDiv.querySelector(".msg-text").textContent = userMsg;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Bot thinking
  setTimeout(() => {
    const messageContent = `
      <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50"
        viewBox="0 0 1024 1024">
        <path d="... (your SVG path) ..."></path>
      </svg>
      <div class="msg-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-msg", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotresponse(incomingMessageDiv);
  }, 600);
};

// Event listeners
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && messageInput.value.trim()) {
    handleOutgoingMessage(e);
  }
});

sendMessageButton.addEventListener("click", (e) => {
  handleOutgoingMessage(e);
});

function goToMentalHealthPage() {
  window.location.href = 'comfortspace.html';
}

function closeModal() {
  document.getElementById('alertModal').style.display = 'none';
  document.getElementById('userInput').value = '';
  document.getElementById('userInput').focus();
}
