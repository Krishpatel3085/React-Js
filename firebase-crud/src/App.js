import { useEffect, useState } from 'react';
import './App.css';
import { addDoc, collection, deleteDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import database from './firebase';


function App() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [val, setVal] = useState([])
  const [id, setId] = useState("")
  const [show, setShow] = useState(false)

  const value = collection(database, "Demo")

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(value);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVal(documents);
    }

    getData();
  }, [value]);

  const handlecreate = async (e) => {
    e.preventDefault();
    await addDoc(value, { name: name, email: email });
    setName("");
    setEmail("");
    setId("")
    setShow(false)
  }

  const handleDelete = async (id) => {
    const deleteVal = doc(database, "Demo", id)
    await deleteDoc(deleteVal)
  }

  const handleEdite = (id, name, email) => {
    setId(id)
    setName(name)
    setEmail(email)
    setShow(true)
  }

  const handleUpdate = async () => {
    const updateVal = doc(database, "Demo", id)
    await updateDoc(updateVal, { name: name, email: email })
    setId("")
    setName("")
    setEmail("")
    setShow(false)
  }

  return (
    <>
      <form >

        <input type="text" placeholder='Enter your name...' value={name} onChange={(e) => setName(e.target.value)} /> <br /> <br />
        <input type="email" placeholder='Enter your email...' value={email} onChange={(e) => setEmail(e.target.value)} /> <br /> <br />

        {
          show ?
            <button onClick={() => handleUpdate()}>Update</button> :
            <button onClick={handlecreate}>Create</button>
        }

      </form>


      {
        val.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <h2>{item.email}</h2>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
            <button onClick={() => handleEdite(item.id, item.name, item.email)}>Edite</button>
          </div>
        ))
      }
    </>
  );
}

export default App;