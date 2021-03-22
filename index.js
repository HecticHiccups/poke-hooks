// import React from 'react';
// import ReactDOM from 'react-dom';
// You can destructure it from react or use React.useState..
// Functions make react more declarative. 
const { useState, useEffect, useReducer, useMemo } = React


//let storage = useRef() // can be used to store values w/o triggering state change 
//useMemo & useCallback are hooks..
//Custom hooks?..function that wraps a hook.
function useDocumentTitle(message) {
    useEffect(()=>{
        document.title = message;
    },[message])
}

//Reducers..(redux) don't need to learn it because context API & reducers
let array = [1,2,3,4,5]
let add = (x,y) => {
    return x+y;
}
let sum = array.reduce(add,0); 
// 0 + 1 
// 1 + 2

const intialState = {count: 0, cake: true, user: {}} 
const actions = [
    {types: "ADD", by: 2},
    {type: "MINUS", by: 4},     
    {type: "EAT_CAKE"}
]

function reducer(state,action){
    if(action.type === "ADD"){
        return {...state, count: state.count + action.by}
    } else if(action.type === "MINUS"){
        return {...state, count: state.count - action.by}
    } else {
        return {...state, cake: false}
    }
}
console.log(actions.reduce(reducer, intialState))


//Component can be seperated into a custom hook.
//You can have as many hooks as you want in a component
//You can convert use state -> use reducer or use them both.
function Pokemon(){
    // const [pokemon, setPokemon] = useState('pikachu');
    // const [img, setImg] = useState(null)
    // const [error, setError] = useState(null)

    //Takes in reducer, & initial state object
    //You can export reducer away
    const [state, dispatch] = useReducer((state, action) =>{
            switch(action.type){
                case 'LOAD_POKEMON': {
                    return {...state, pokemon: action.name, img: action.img }
                }
                case 'ERROR': {
                    return {...state, error: action.error}
                }
                case 'USER_INPUT': {
                    return {...state, pokemon: action.pokemon }
                }
                default: {
                    return {state}
                }
            }

    }, {
        pokemon: 'pikachu',
        img: null,
        error: null,
    })

    let {pokemon, img, error} = state
 
    //reduce complexity of application only performs action when needed.
    //returns a value unlike useEffect..
    const someValue = useMemo(() => {
        return 'cake' + pokemon;
    },[pokemon])
    
    let message = `I choose you! ${pokemon}`
    useDocumentTitle(message);

    //Whenever array changes it recalls the first parameter.
    //Is run on initial render, componentWillMount, on every state change
    //Replacing a lot of lifecycle, function stays in sync with 2nd params
    //[var] effect is run on intiail render when var changes.
    //[] run on intial only,
    //nothing, run on initial render, as well as every state change...
    


    //Runs on when component mounts, fetches onChange event of value(Pokemon Value is set)
    //resetting state after parsing API data when event occurs.
    //set the error state if an error occurs.
    //conditionally render to the page the image if it exists. 
    //ensure effect is up to date.
    useEffect(() => {
        let isCurrent = true;
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
        .then(res => res.json())
        .then(res => {
            if(isCurrent) {
           dispatch({type: 'LOAD_POKEMON', name: res.name, img: res.sprites.front_shiny})
         }  
          //setPokemon(res.name);
         //setImg(res.sprites.front_shiny) 
        })
        .catch((emAll) => {
            //setError(emAll)
             dispatch({type: "ERROR", emAll})
        })
       
        //Aborting request...
        return () => {
            isCurrent = false;
        }
    },[pokemon, img, error])
    
    return (<div>
    <input onChange={e => {
    //setPokemon(e.target.value)
    dispatch({type: 'USER_INPUT', pokemon: e.target.value})
    }} value={pokemon} type="text"/>
    <br/> 
     Hello {pokemon}

     {img && <img src={img} alt={pokemon} />}
    </div>
    )
}
 

//state variables are rerendered when changed due to react. 
function Counter(){
    let [count, setCount] = useState(0);
     
    const add = () => {
       setCount(count + 1);
    }
    const subtract = () => {
        setCount(count - 1);
    }

    return (<div>
        <div>Current Count: {count} </div>
        <Button fish={add}>Add</Button>
        <Button fish ={subtract}>Subtract</Button>
        </div>)
}

//Button Component [Children(child el), fish(onClick)]
const Button = ({children, fish}) =>{
  return  <button onClick={fish}>{children}</button>
} 

const reactEl = <div>Hello</div>
const domEl = document.getElementById('root');


ReactDOM.render(
   <div>
    <Pokemon/>
    <Counter/>
    </div>
,domEl);