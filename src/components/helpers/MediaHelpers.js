//Formats year to look more presentable to users
export const yearFormat = (year) => {
  let formattedYear = year;


  //if year has a dash in it, format it with a space to look nicer!
  if (formattedYear.includes("–")) {

    formattedYear = formattedYear.split("–").join(" – ");
    
    //If dash is at the end without an ending year date, format date so it shows "current"
    if (formattedYear.charAt(formattedYear.length-2) === "–") {
      formattedYear = `${formattedYear}Current`
    }
    
  }
  return formattedYear;
}


//Turns the first letter of the given type into an uppercase
export const typeFormat = (type) => {
  let formattedType = type;
  formattedType = formattedType.charAt(0).toUpperCase() + formattedType.slice(1);

  return formattedType;
}
