import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'
import { userService } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia para el registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, username, password, done) => { 
            try {
                const { nombre, email, age, apellido } = req.body;

            let existe = await userService.findOne({ email: username });
            if (existe) {
                console.log("Usuario ya existe");
                return done(null, false);
            }

            let usuario;
            password = createHash(password);
                usuario = await userService.create({ nombre, password, email, apellido, age });
                return done(null, usuario); 
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }
        }
    ));

    // Serialización y deserialización de usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    // Estrategia para el inicio de sesión
    passport.use('login', new LocalStrategy({passReqToCallback:true ,usernameField: 'email' }, 
        async (username, password, done) => { 
            try {
                const user = await userService.findOne({ email: username });
                if (!user) {
                    console.log("El usuario no existe");

                    return done(null, false);
                }

                if (!isValidPassword(user, password)) {
                    console.log("Contraseña incorrecta");
                    return done(null, false);
                }
                req.session.usuario={
                    nombre:usuario.nombre, email:usuario.email, telefono:usuario.telefono, direccion:usuario.direccion, fiado:usuario.fiado, dia:usuario.dia
                }
                return done(null, user);
            } catch (error) {
                return done(error, null)
            }
        }
    ))

    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.df233c11a00a22f1",
        clientSecret:"6352918f1ec7709aeaea54a7593fb661b3dbf88d",
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            console.log(profile)
            let user = await userService.findOne({email:profile._json.email})
            if(!user){
                let newUser ={
                    nombre: profile._json.name,
                    apellido: '',
                    age:20,
                    email: profile._json.email,
                    password:''
                }
                let result = await userService.create(newUser)
                done(null, result)
            } else{
                done(null, user)
            }
            
        } catch (error) {
            return done(error)
        }
    } ))
}

export default initializePassport;
