export const mongo = {
    dbName: 'mykinoplex',
    //change localhost with ipaddress of the system or the hostname
    URI: 'mongodb://localhost:27017, localhost:27018, localhost:27019/mykinoplex', // connecting to mykinoplex
    authSource: 'mykinoplex',
    user: 'node',
    pass: 'password',
    retryWrites: false,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
};

export const API_PORT = 3001;

export const JWT_SECRET = 'thisismyjwtsecret' || process.env.JWT_SECRET;