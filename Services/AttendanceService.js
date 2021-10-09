import firebase from "../config/Firebase";
import moment from 'moment';

const db = firebase.database();
const ref = 'attendance';

class AttendanceService {

    fetchAll = () => {
        return db.ref(ref);
    }

    fetchById = id => {
        return db.ref(ref).child(id).once('value');
    }

    create = (id, data) => {
        let date = moment().format('YYYY-MM-DD')
        return db.ref(ref).child(date).child(id).set(data);
    }

}

export default new AttendanceService();