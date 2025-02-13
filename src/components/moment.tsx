import moment from 'moment';
const dateconvert = (date) => {
    const isoDate = date;
    const formattedDate = moment(isoDate).format('D,M,YYYY'); // Example: "January 15, 2024"
    return formattedDate;
}  

export default dateconvert