import formatTodosForAI from "./fetchTodosForAI";

const fetchSuggestion=async(board:Board)=>{
    
    const todos=formatTodosForAI(board);
    
    const res = await fetch('/api/generateSummary',{
        method:'POST',
        headers:{
          'Content-Type' :'application/json',
        },
        body:JSON.stringify(todos),
      });
     
    const GPTdata = res.json();
    
    return GPTdata;
}
export default fetchSuggestion;