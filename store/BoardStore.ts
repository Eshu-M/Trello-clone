import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { database, storage } from '@/appwrite';

interface BoardState{
    board:Board;
    getBoard:()=>void;
    setBoardState:(board:Board)=>void;
    updateTodoInDB:(todo:Todo , columnId:TypedColumn)=>void;
    searchString:string;
    setSearchString:(searchString : string) => void;
    deleteTask:(taskIndex:number , todoId:Todo , id:TypedColumn)=>void;
}

export const useBoardStore = create<BoardState>((set , get) => ({
  board:{
    columns:new Map<TypedColumn , Column>()
  },
  searchString : "",
  setSearchString : (searchString) => set({searchString}),

  getBoard:async ()=>{
    const board =await getTodosGroupedByColumn();
    set({board});
  },
  setBoardState:(board) =>set({board}),

  updateTodoInDB:async(todo , columnId)=>{
    await database.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,{
          title:todo.title,
          status:columnId,
        }
    );
  },
  deleteTask:async (taskIndex, todoId, id)=> {
    const newColumn=new Map(get().board.columns);
    //delete the task
    newColumn.get(id)?.todos.splice(taskIndex,1);
    set({board:{columns:newColumn}});

    //to delete in the database 

    if(todoId.image){
      await storage.deleteFile(todoId.image.bucketId, todoId.image.fileId);
    }
    // delete other attribute of the task 

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todoId.$id,
    )
  },
}))