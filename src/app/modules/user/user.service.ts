import { User } from './user.model';

const createStudentIntoDB = async (studentData: TSu) => {
  const result = await User.create(student);
  return result;
};

export const UserService = {
  createStudentIntoDB,
};
