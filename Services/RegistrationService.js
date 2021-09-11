import firebase from "../config/Firebase";
import { Alert } from "react-native";

const db = firebase.database();
const ref = 'masterlist';

const storageRef = firebase.storage();

class RegistrationService {

    fetchAll = () => {
        return db.ref(ref);
    }

    fetchById = id => {
        return db.ref(ref).child(id).once('value');
    }

    create = (id, data) => {
        return db.ref(ref).child(id).set(data);
    }

    uploadPhoto = async (id, uri) => {
        var ref = storageRef.ref().child("images/" + id);

        const response = await fetch(uri);
        const blob = await response.blob();

        return ref.put(blob);
    }

    getPhotoUrl = id => {
        var ref = storageRef.ref().child("images/" + id);
        return ref.getDownloadURL();
    }

}

export default new RegistrationService();