function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let formattedTime = '';
    
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }
    
    if (remainingMinutes > 0) {
        formattedTime += `${remainingMinutes}m`;
    }

    return formattedTime.trim();
}

export default formatTime