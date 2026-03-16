import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { ApiError } from '../utils/apiError.js';
export class AuthService {
    userRepository;
    constructor(userRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }
    async register(email, password) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ApiError(409, 'User already exists', 'USER_EXISTS');
        }
        const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);
        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
            expiresIn: env.jwtExpiresIn,
        });
        return {
            user: this.toSafeUser(user),
            token,
        };
    }
    async authenticate(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
            expiresIn: env.jwtExpiresIn,
        });
        return {
            user: this.toSafeUser(user),
            token,
        };
    }
    async getCurrentUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
        }
        return this.toSafeUser(user);
    }
    toSafeUser(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
