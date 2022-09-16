import bcrypt from 'bcrypt'

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  return hashPassword
}

export const comparePassword = async (password, encryptedPassword) => {
  const matchPassword = await bcrypt.compare(password, encryptedPassword)
  if (matchPassword) {
    return true
  } else {
    return false
  }
}
