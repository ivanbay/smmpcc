import firebase from "../config/Firebase";
import { Alert } from "react-native";

const db = firebase.database();
const ref = 'schedules';


class ScheduleService {

    add = (data) => {
        return db.ref(ref).push(data);
    }

}

export default new ScheduleService();