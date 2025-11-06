import React from 'react'
import SearchForm from './component/SearchForm'
import AddUser from './component/AddUser'
import ResultTable from './component/ResultTable'
import './App.css'

function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);
  return (
    <>
      <div>
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
        <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
      </div>
    </>
  )
}

export default App
