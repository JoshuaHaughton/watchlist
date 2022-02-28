//Turns the first letter of the given type into an uppercase
export const typeFormat = (type) => {
  let formattedType = type;
  formattedType = formattedType.charAt(0).toUpperCase() + formattedType.slice(1);

  return formattedType;
}
