import {pool} from './conexion.js'; 

export async function testConexion(){ 
    try{
        const con = await pool.getConnection(); 
        console.log('Conexion a base de datos correcta'); 

        const [resulst] = await con.query('SELECT NOW() AS hora_servidor, DATABASE() AS base_datos'); 
        console.log(resulst); 
        console.table(resulst); 


        con.release(); 
    }catch(error){
        console.log('error al conectarse a la base de datos', error); 
        console.error({
            codigo:error.code, 
            mensaje:error.message
        }); 

        process.exit(1); 

    }
}