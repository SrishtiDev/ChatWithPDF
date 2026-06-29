import express from 'express';

const upload = multer({dest:'uploads/'});

const app = express();
app.use(cors());

app.get('/',(req,res) =>{
    return res.json({status:'All Good!'})
})

app.post('/upload/pdf',XMLHttpRequestUpload.single('pdf'));
app.listen(8000,() => console.log(`Server started on PORT:${8000}`));