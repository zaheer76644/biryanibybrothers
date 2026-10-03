export function validateCustomer(customer) {
  const errors = {};
  const name = customer.fullName.trim();
  const mobile = customer.mobile.replace(/\D/g, "");

  if (name.length < 2) errors.fullName = "Please tell us your name.";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Enter a 10-digit mobile number.";
  if (!customer.flat.trim()) errors.flat = "We need a flat or house number.";
  if (!customer.building.trim()) errors.building = "Add the building or society name.";
  if (!customer.area.trim()) errors.area = "Which area should we deliver to?";
  if (!/^\d{6}$/.test(customer.pincode.trim())) errors.pincode = "Enter a 6-digit pincode.";
  if (!customer.confirmed) errors.confirmed = "Please confirm your delivery details.";

  return errors;
}

export function digitsOnly(value, max) {
  return value.replace(/\D/g, "").slice(0, max);
}
