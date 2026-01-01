import { User } from '@/types/user.type';
import type { NextApiRequest, NextApiResponse} from 'next'

export default function getAllUsers(req: NextApiRequest,
  res: NextApiResponse<User>){
    res.status(200).json
}