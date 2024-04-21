import {useState} from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [prompt,setPrompt] = useState("");
  const [chat,setChat] = useState([]);
  const [loading,setLoading] = useState(false);


  const handleSubmit = async (e)=>{
      e.preventDefault();
      console.log(prompt)
      if(prompt===""){
        return
      }

      setLoading(true);

      let data = JSON.stringify({
        "contents": [
          {
            "parts": [
              {
                "text": prompt
              }
            ]
          }
        ]
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log(response.data.candidates[0].content.parts[0].text)
        let temp = chat.slice();
        temp.push([prompt,response.data.candidates[0].content.parts[0].text])
        setChat(temp);
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading(false)
      setPrompt("")

  }

  return (
    <div id='main'>
      <h1 style={{marginLeft:'35%',fontFamily:['monospace']}}>My First ChatBot</h1> 
      <div id="output">
      {chat.map((x,idx)=>{
        return (
          <>
            <div key={idx} className="chat-text-box">{"Prompt:\n"+x[0]}</div>
            <div key={idx} className="chat-text-box">{"Response:\n"+x[1]}</div>
          </>
        )
      })}
      </div>
      <form id="prompt-form" onSubmit={(e)=>{handleSubmit(e)}}>
        <div>
          <input type="text" id="prompt" value={prompt} disabled={loading} onChange={(e)=>setPrompt(e.target.value)}></input>
        </div>
        <button id="send" type="submit" onClick={(e)=>{handleSubmit(e)}}>{(loading)?"Loading...":"Send"}</button>
      </form>
    </div>
  );
}

export default App;
