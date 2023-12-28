import { Router } from "express"
import passport from 'passport'

export const router=Router()

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async(req, res)=>{
    if(!req.usuario) return res.status(400).send({status:"error", error:"Invalid credentials"})
    req.session.usuario = {
        nombre:req.usuario.nombre,
        apellido: req.usuario.apellido,
        email: req.usuario.email,
        age: req.usuario.age
    }
    res.send({status:"success", payload:req.user})
})

router.get('/faillogin', (req, res) =>{
    res.send({error:"Failed Login"})
})

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async(req, res) => {
    res.send({status:"success", message:"User registered"})
})

router.get('/failregister', async(req,res) => {
    console.log("failed Strategy")
    res.send({error:"Failed"})
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api/sessions/errorGithub'}), async(req, res)=>{
    console.log(req.user)
    req.session.usuario=req.user
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Acceso OK...!!!", usuario: req.user
    });
})

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
});

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })

    res.redirect('/login')
})