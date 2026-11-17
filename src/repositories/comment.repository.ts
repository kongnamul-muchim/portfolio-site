import { prisma } from '@/lib/db/prisma'
import { Comment } from '@prisma/client'
import { withShownAuthor } from '@/lib/display'

export interface ICommentRepository {
  findById(id: string): Promise<Comment | null>
  findByPostId(postId: string): Promise<Comment[]>
  findAllForAdmin(options?: { take?: number }): Promise<Comment[]>
  create(data: { content: string; authorId: string; postId: string; parentId?: string }): Promise<Comment>
  delete(id: string): Promise<void>
}

const AUTHOR_SELECT = { id: true, nickname: true, displayName: true } as const

export class CommentRepository implements ICommentRepository {
  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id } })
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: AUTHOR_SELECT },
        replies: {
          include: {
            author: { select: AUTHOR_SELECT }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 각 댓글과 답글의 author.nickname 을 표시 이름으로 바꿔 내보낸다
    return comments.map((c) =>
      withShownAuthor({ ...c, replies: (c.replies ?? []).map((r) => withShownAuthor(r)) })
    )
  }

  async create(data: { content: string; authorId: string; postId: string; parentId?: string }) {
    const comment = await prisma.comment.create({
      data,
      include: {
        author: { select: AUTHOR_SELECT }
      }
    })
    return withShownAuthor(comment)
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } })
  }

  async findAllForAdmin(options?: { take?: number }): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      include: {
        author: { select: AUTHOR_SELECT },
        post: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: options?.take ?? 100
    })
    return comments.map(withShownAuthor)
  }
}
