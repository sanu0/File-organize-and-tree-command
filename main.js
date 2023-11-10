#!/usr/bin/env node
// The above script is written to make our script global.

let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");

let types = { //using this object and extension we will know our file belongs to which folder
    media : ["mp4" , "mkv"],
    archives : ['zip','7z','rar','tar','gz','ar','iso','xz'],
    documents: ['docx','doc','pdf','PDF','xlsx','xls','odt','odp','odg','odf','txt','ps','tex'],
    app : ['exe','dmg','pkg','deb'],
    programming_files : ['c','cpp','java','py'],
    images : ['jpg','png','jpeg']
}
//console.log(inputArr);

// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help

// We are taking commands as array of string in out inputArr and 
// we are doing operations on it to execute it.
let command = inputArr[0];
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please, Input right command!");
        break;

}

 function treeFn(dirPath){
    if(dirPath == undefined){
        //console.log("kindly enter the path");
        treeHelper(process.cwd(),"");
        return;
    }
    // now we check if the path passed is of diectory or not
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            let indent = "";
           treeHelper(dirPath,indent);
            
        }else{
            console.log("kindly enter the correct path");
            return;
        }
    }

}

 function organizeFn(dirPath){
    //console.log("Organize command implmented for ",dirPath);
    // 1. input -> directry path given
        // if you don't give any path while calling the function then js will give undefined ath and still will run.
        // so we have to first check for undefined

        let destPath;
        if(dirPath == undefined){
            destPath = process.cwd();
            return;
        }
        // now we check if the path passed is of diectory or not
        else{
            let doesExist = fs.existsSync(dirPath);
            if(doesExist){
                
                // 2. create -> organised_files -> directory
                destPath = path.join(dirPath,"Orgaized_files");
                if(fs.existsSync(destPath) == false){ // we first check if the organised file folder alredy exist or not if not then only then you will make a new one.
                    fs.mkdirSync(destPath);
                }
                
            }else{
                console.log("kindly enter the correct path");
                return;
            }
        }
    
    // 3. check all files in given directory and identify its category->
    organizeHelper(dirPath,destPath);
    // 4. copy / cut files to that organised directory inside of any category folder
    

}

 function helpFn(){
    console.log(`
        List of All the commands : 
            node main.js tree "directoryPath"
            node main.js organize "directoryPath"
            node main.js help
    `);
}

 function organizeHelper(src,dest){
    // 3. check all files in given directory and identify its category->

    let childNames = fs.readdirSync(src);
    //console.log(childNames);
    // now the childNames shows the number of items in that directory.
    // if item is folder than we do nothing but if it is a file then we will organize it.
    for(let i=0;i<childNames.length;i++){
        let childAdress = path.join(src,childNames[i]);
        //now we get the address of all the files inside that src directory.
        let isFile = fs.lstatSync(childAdress).isFile();
        if(isFile){
           // console.log(childNames[i]);
           let category = getCategory(childNames[i]);
           console.log(childNames[i] + " belongs to -> "+ category);
            
           // 4. copy / cut files to that organised directory inside of any category folder
           sendFiles(childAdress,dest,category);
        }
        // if you know recusrion than you can go inside the folders as well and organize it
        //That feature will come in version 2.0;
    }


    
}

function sendFiles(srcFilePath,dest,category){
    //If no oraganized category folder exist then create
    let categoryPath =  path.join(dest, category);
    if(fs.existsSync((categoryPath)) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    // so first create an empty file and then content is copied not file itself.
    fs.copyFileSync(srcFilePath, destFilePath);
    //fs.unlinkSync(srcFilePath);
    // This above line is applied only when it is to cut and paste file and not copy and paste
    console.log(fileName, "copied to -> ", category);

}

function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types){
        let cTypeArray = types[type];
        for(let i =0;i<cTypeArray.length;i++){
            if(ext == cTypeArray[i]){
                return type;
            }
        }   
    }
    return "others";
}

function treeHelper(dirPath, indent){
    // You now have to draw the tree structure.
    //If it is file then print
    // If it is folder go inside

    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + "|~~~" + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent + "|___" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0;i<childrens.length;i++){
            let childPath= path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent +"\t")
        }
    }
}