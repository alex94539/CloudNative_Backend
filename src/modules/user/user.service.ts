import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: '9f1aea00d0c3c454e90137000b150785c5f4980e88d18dd1bf94ce3713fe6768',
        },
        {
            userId: 2,
            username: 'maria',
            password: '9a5570a7818949b63166cfc20ddc6db47875917aab14ea01e0d2abe3ea4210e9',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
