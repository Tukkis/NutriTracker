const formatMealDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  // getMonth() returns 0-11, so add 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default formatMealDate