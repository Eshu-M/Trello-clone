import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { ID, database, storage } from '@/appwrite';
import uploadImage from '@/lib/uploadImage';

interface BoardState{
    board:Board;
    getBoard:()=>void;
    setBoardState:(board:Board)=>void;
    updateTodoInDB:(todo:Todo , columnId:TypedColumn)=>void;
    searchString:string;
    newTaskInput:string;
    image:File | null;
    setImage:(image:File | null)=>void;
    newTaskType:TypedColumn;
    setNewTaskType:(columnId:TypedColumn)=>void;
    setNewTaskInput:(newTaskInput : string) => void;
    setSearchString:(searchString : string) => void;
    deleteTask:(taskIndex:number , todoId:Todo , id:TypedColumn)=>void;
    addTaskToDB:(todo:string , columnId:TypedColumn  , image?:File | null)=>void;
}

export const useBoardStore = create<BoardState>((set , get) => ({
  board:{
    columns:new Map<TypedColumn , Column>()
  },
  searchString : "",
  newTaskInput : "",
  newTaskType :"todo",
  image : null,
  setImage:(image:File | null )=>set({image}),
  setSearchString : (searchString) => set({searchString}),
  setNewTaskInput : (input:string) => set({newTaskInput:input}),
  setNewTaskType:(columnId:TypedColumn)=>set({newTaskType:columnId}) ,
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
  addTaskToDB: async (todo:string, columnId:TypedColumn, image?:File | null) =>{
    let file :Image | undefined;

    if(image){
      // if there is an image the image will be uploaded to appwrite.
      const fileUploaded = await uploadImage(image);
      if(fileUploaded){
        file={
          bucketId:fileUploaded.bucketId,
          fileId:fileUploaded.$id,
        };
      }
    }

    // uploading the added task to the db

    const {$id} = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title:todo,
          status:columnId,
          // the below code will check if the user also added an image if so also include the image
          ...(file && {image:JSON.stringify(file)}),
        } 
    );
    set({newTaskInput:""});

    set((state)=>{
      const newColumn = new Map(state.board.columns);
      const newTodo:Todo={
        $id,
        $createdAt:new Date().toISOString(),
        title:todo,
        status:columnId,
        ...(file && {image:file}),
      };

      const column = newColumn.get(columnId);

      if(!column){
        newColumn.set(columnId,{
          id:columnId,
          todos:[newTodo],
        });
      }else{
        newColumn.get(columnId)?.todos.push(newTodo);
      }
      return{
        board:{
          columns:newColumn,
        }
      }
    })
  },
}))