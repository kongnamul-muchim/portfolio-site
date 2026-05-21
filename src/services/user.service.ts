import { IUserRepository, UserRepository } from '@/repositories/user.repository'
import bcrypt from 'bcryptjs'

export class UserService {
  private userRepository: IUserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async signUp(nickname: string, password: string) {
    const existingNickname = await this.userRepository.findByNickname(nickname)
    if (existingNickname) throw new Error('이미 사용 중인 닉네임입니다.')

    const hashedPassword = await bcrypt.hash(password, 10)
    // 이메일 대신 자동 생성된 placeholder 사용
    const placeholderEmail = `user_${nickname.toLowerCase().replace(/[^a-z0-9]/g, '_')}@local.port`
    return this.userRepository.create({ email: placeholderEmail, password: hashedPassword, nickname })
  }

  async validateUser(nickname: string, password: string) {
    const user = await this.userRepository.findByNickname(nickname)
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    return { id: user.id, email: user.email, nickname: user.nickname, role: user.role }
  }

  async getAllUsers() {
    return this.userRepository.findAll()
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id)
  }

  async updateRole(id: string, role: string) {
    return this.userRepository.updateRole(id, role)
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new Error('사용자를 찾을 수 없습니다.')
    
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    }
  }

  async updateProfile(userId: string, nickname?: string, profileImage?: string | null) {
    if (nickname) {
      const existing = await this.userRepository.findByNickname(nickname)
      if (existing && existing.id !== userId) {
        throw new Error('이미 사용 중인 닉네임입니다.')
      }
    }

    const updateData: { nickname?: string; profileImage?: string } = {}
    if (nickname) updateData.nickname = nickname
    if (profileImage !== undefined) updateData.profileImage = profileImage ?? undefined

    return this.userRepository.updateProfile(userId, updateData)
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new Error('사용자를 찾을 수 없습니다.')

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) throw new Error('현재 비밀번호가 일치하지 않습니다.')

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    return this.userRepository.updatePassword(userId, hashedPassword)
  }

  async getMyPosts(userId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize
    const [posts, totalCount] = await Promise.all([
      this.userRepository.findPostsByUserId(userId, { skip, take: pageSize }),
      this.userRepository.countPostsByUserId(userId)
    ])
    return { posts, totalCount, totalPages: Math.ceil(totalCount / pageSize) }
  }

  async getMyComments(userId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize
    const [comments, totalCount] = await Promise.all([
      this.userRepository.findCommentsByUserId(userId, { skip, take: pageSize }),
      this.userRepository.countCommentsByUserId(userId)
    ])
    return { comments, totalCount, totalPages: Math.ceil(totalCount / pageSize) }
  }
}