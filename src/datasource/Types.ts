export interface Course {
  id?: any;
  cname?: string;
  ctime?: number;
  cnum?: number; //课程学生人数
  userid?: any;
}

export interface User {
  id?: any;
  name?: string;
  phone?: string;
  password?: string;
  role?: number;
  courses?: Course[];
}

export interface laboratory {
  id?: any;
  classnum?: number;
  mnum?: number;
  message: string;
  laborcheck: number;
}
