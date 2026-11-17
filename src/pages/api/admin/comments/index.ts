import { getValidSession } from '@/lib/auth/valid-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CommentService } from '@/services/comment.service'

const commentService = new CommentService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getValidSession(req, res)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const comments = await commentService.getAllCommentsForAdmin()

  return res.status(200).json(comments)
}