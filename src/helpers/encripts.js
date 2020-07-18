const bcrypt = require('bcryptjs');
const encriptar = async(text)=> {
        const salt =  await bcrypt.genSalt(10);
        const hash = bcrypt.hash(text,salt);
        return hash;
}
module.exports.encriptar = encriptar;