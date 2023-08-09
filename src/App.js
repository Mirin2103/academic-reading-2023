import {useState, useEffect} from 'react'

const App = () => {
    const [value, setValue] = useState(null)
    const [language, setLanguage] = useState(null)
    const [maxLength, setmaxLength] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: "Kannst du folgenden Text: '" + value + "' zusammenfassen" + getLanguage() + getMaxLength(),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try{
            const response = await fetch('http://localhost:8000/completions', options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        }catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(currentTitle, value, message)
        if(!currentTitle && value && message) {
            setCurrentTitle(value)
        }
        if(currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats,
                    {
                        title: currentTitle,
                        role: "user",
                        content: value
                    },
                    {
                        title: currentTitle,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))
        }
    }, [message, currentTitle])

console.log(previousChats)
    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))


    function getRole(role) {
        if(role === "user") {
            return "Text"
        } else {
            return "Summary"
        }
    }

    function getLanguage() {
        if(language === null) {
            return "?"
        } else {
            return " und die Zusammenfassung auf " + language + " übersetzen?"
        }
    }

    function getMaxLength() {
        if(maxLength === null) {
            return ""
        }else {
            return "Die Zusammenfassung sollte maximal " + maxLength + " Wörter lang sein."
        }
    }

    function uploadPDF() {

    }

    function resizeUniqueTitle(uniqueTitle) {
        if(uniqueTitle.length <= 15) {
            return uniqueTitle
        }else {
            return uniqueTitle.substring(0,10)
        }
    }

    function clearInput() {
        setValue("")
    }

    return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Summary</button>
        <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{resizeUniqueTitle(uniqueTitle)}</li>)}
        </ul>
        <nav>
          <p>Academic Reading</p>
        </nav>
      </section>

      <section className="main">
          {!currentTitle && <h1>Acadamic Reading</h1>}
          <ul className="feed">
              {currentChat?.map((chatMessage, index) => <li key={index}>
                    <p className="role">{getRole(chatMessage.role)}</p>
                    <p>{chatMessage.content}</p>
                  </li>)}
          </ul>
          <div className="bottom-section">
              <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)}/>
              </div>
              <div className="pdf-section">
                  <button onClick={clearInput}>Clear</button>
                  <button onClick={uploadPDF}>Upload PDF</button>
                  <input placeholder="Sprache" value={language} onChange={(e) => setLanguage(e.target.value)}/>
                  <input placeholder="Max. Wörter" value={maxLength} onChange={(e) => setmaxLength(e.target.value)}/>
                  <button onClick={getMessages}>Summarize</button>
              </div>
              <p className="info">
                  Diese Webseite dient der Zusammenfassung von Texten.
                  Ein Projekt an der Universität Hildesheim.
              </p>
          </div>
      </section>
    </div>
  )
}
export default App;