/* ==============================
   BACKEND URL
============================== */

const API_URL = "https://personal-ai-chatbot-bay.vercel.app/chat";


/* ==============================
   GET HTML ELEMENTS
============================== */

const messages = document.getElementById("messages");

const questionInput =
    document.getElementById("question");

const sendButton =
    document.getElementById("sendButton");


/* ==============================
   SEND MESSAGE
============================== */

async function sendMessage() {

    const question =
        questionInput.value.trim();


    // Don't send empty question

    if (question === "") {

        return;

    }


    // Show user's question

    addUserMessage(question);


    // Clear input

    questionInput.value = "";


    // Show AI thinking animation

    const loadingMessage =
        addLoadingMessage();


    // Disable send button

    sendButton.disabled = true;


    try {

        /*
            Send question to FastAPI
        */

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    question: question

                })

            });


        /*
            Check server response
        */

        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        /*
            Convert response to JSON
        */

        const data =
            await response.json();


        // Remove loading animation

        loadingMessage.remove();


        // Display AI answer

        addAIMessage(data.answer);


    } catch (error) {

        console.error(error);


        // Remove loading animation

        loadingMessage.remove();


        // Show error

        addAIMessage(
            "Sorry, I couldn't connect to the AI server. Please make sure the FastAPI backend is running."
        );

    }


    // Enable send button

    sendButton.disabled = false;


    // Put cursor back in input

    questionInput.focus();

}


/* ==============================
   ADD USER MESSAGE
============================== */

function addUserMessage(text) {

    const message =
        document.createElement("div");


    message.className =
        "message user-message";


    message.innerHTML = `

        <div class="message-content">

            <div class="message-name">
                You
            </div>

            <div class="bubble">
                ${escapeHTML(text)}
            </div>

        </div>

    `;


    messages.appendChild(message);


    scrollToBottom();

}


/* ==============================
   ADD AI MESSAGE
============================== */

function addAIMessage(text) {

    const message =
        document.createElement("div");


    message.className =
        "message ai-message";


    message.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <div class="message-name">
                HireMeAI
            </div>

            <div class="bubble">
                ${formatText(text)}
            </div>

        </div>

    `;


    messages.appendChild(message);


    scrollToBottom();

}


/* ==============================
   LOADING MESSAGE
============================== */

function addLoadingMessage() {

    const message =
        document.createElement("div");


    message.className =
        "message ai-message";


    message.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <div class="message-name">
                HireMeAI
            </div>

            <div class="bubble">

                <div class="typing">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        </div>

    `;


    messages.appendChild(message);


    scrollToBottom();


    return message;

}


/* ==============================
   QUICK QUESTION
============================== */

function askQuestion(question) {

    questionInput.value = question;

    sendMessage();

}


/* ==============================
   ENTER KEY
============================== */

questionInput.addEventListener(
    "keydown",
    function(event) {

        /*
            Enter = send

            Shift + Enter = new line
        */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* ==============================
   AUTO SCROLL
============================== */

function scrollToBottom() {

    messages.scrollTo({

        top: messages.scrollHeight,

        behavior: "smooth"

    });

}


/* ==============================
   SECURITY
============================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


/* ==============================
   FORMAT AI TEXT
============================== */

function formatText(text) {

    return escapeHTML(text)
        .replace(/\n/g, "<br>");

}