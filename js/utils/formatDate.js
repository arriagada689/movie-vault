function formatDate(str){
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateObj = new Date(str)
    return dateObj.toLocaleDateString('en-US', options);
} 

export default formatDate