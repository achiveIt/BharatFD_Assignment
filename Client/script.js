const BACKEND_URL = "http://13.203.76.90:8000"
tinymce.init({
    selector: '#answerInput',
    height: 300,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help',
});

let faqs = [];
let editingIndex = -1;
let currentLanguage = 'en';

function addFAQ() {
    const question = document.getElementById('questionInput').value;
    const answer = tinymce.get('answerInput').getContent();

    if (question && answer) {
        fetch(`${BACKEND_URL}/api/v1/Admin/faq`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question, answer }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("FAQ added successfully!");
            document.getElementById('questionInput').value = '';
            tinymce.get('answerInput').setContent('');
            showAllFAQs(); 
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("Please enter both question and answer.");
    }
}

function displayFAQs() {
    fetch(`${BACKEND_URL}/api/v1/User/faq?lang=${currentLanguage}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.message || !Array.isArray(data.message)) {
                throw new Error("Invalid data format: Expected an array inside 'message'");
            }

            const faqList = document.getElementById("faqList");
            faqList.innerHTML = "";

            data.message.forEach(faq => {
                if (!faq._id) {
                    console.warn("Skipping FAQ without _id:", faq);
                    return;
                }

                const faqItem = document.createElement("div");
                faqItem.className = "faq-item";
                faqItem.innerHTML = `
                    <h3>${faq.question}</h3>
                    <div>${faq.answer}</div>
                    <button onclick="editFAQ('${faq._id}')">Edit</button>
                    <button onclick="deleteFAQ('${faq._id}')">Delete</button>
                `;
                faqList.appendChild(faqItem);
            });

            const languageSelectContainer = document.getElementById('languageSelectContainer');

            if (faqList.innerHTML.trim() !== "") {
                languageSelectContainer.classList.remove('hidden'); 
            } else {
                languageSelectContainer.classList.add('hidden'); 
            }
        })
        .catch(error => console.error("Error fetching FAQs:", error));
}


function editFAQ(editingIndex) {
    if (editingIndex === -1) {
        alert("No FAQ selected for update.");
        return;
    }

    const updatedQuestion = document.getElementById('questionInput').value;
    const updatedAnswer = tinymce.get('answerInput').getContent();

    if (!updatedQuestion.trim() && !updatedAnswer.trim()) {
        alert("Both question or answer must be provided.");
        return;
    }

    fetch(`${BACKEND_URL}/api/v1/Admin/faq/${editingIndex}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: updatedQuestion, answer: updatedAnswer })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('questionInput').value = "";
        tinymce.get('answerInput').setContent("");
        editingIndex = -1;
        document.getElementById('addButton').textContent = 'Add FAQ';
        displayFAQs(); 
    })
    .catch(error => console.error("Error updating FAQ:", error));
}


function deleteFAQ(faqId) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
        fetch(`${BACKEND_URL}/api/v1/Admin/faq/${faqId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(() => {
            displayFAQs(); 
        })
        .catch(error => console.error("Error deleting FAQ:", error));
    }
}


function showAllFAQs() {
    displayFAQs();
}

function changeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    currentLanguage = languageSelect.value;
    displayFAQs();
}