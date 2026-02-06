import neo4j, { Driver } from 'neo4j-driver';
import type { UserProfile, HeroPath, Wallet, Squad, Psychometrics } from '../context/UserContext';

const URI = import.meta.env.VITE_NEO4J_URI || 'bolt://localhost:7687';
const USER = import.meta.env.VITE_NEO4J_USER || 'neo4j';
const PASSWORD = import.meta.env.VITE_NEO4J_PASSWORD || 'password';

let driver: Driver;

try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
} catch (err) {
    console.error('Neo4j Driver Initialization Failed', err);
}

export const Neo4jService = {
    async saveUserProfile(userId: string, profile: UserProfile, path: HeroPath, wallet: Wallet, psychometrics: Psychometrics) {
        const session = driver.session();
        try {
            await session.executeWrite(tx =>
                tx.run(
                    `MERGE (u:User {id: $userId})
                     SET u.name = $name,
                         u.age = $age,
                         u.passion = $passion,
                         u.style = $style,
                         u.role = $role,
                         u.level = $level,
                         u.xp = $xp,
                         u.balance = $balance,
                         u.autonomy = $autonomy,
                         u.competence = $competence,
                         u.relatedness = $relatedness,
                         u.history = $history
                     RETURN u`,
                    {
                        userId,
                        name: profile.name,
                        age: profile.age,
                        passion: profile.passion,
                        style: profile.style,
                        role: path.role,
                        level: path.level,
                        xp: path.xp,
                        balance: wallet.balance,
                        autonomy: psychometrics.autonomy,
                        competence: psychometrics.competence,
                        relatedness: psychometrics.relatedness,
                        history: path.history
                    }
                )
            );
        } finally {
            await session.close();
        }
    },

    async updatePsychometrics(userId: string, psychometrics: Psychometrics) {
        const session = driver.session();
        try {
            await session.executeWrite(tx =>
                tx.run(
                    `MATCH (u:User {id: $userId})
                     SET u.autonomy = $autonomy,
                         u.competence = $competence,
                         u.relatedness = $relatedness
                     RETURN u`,
                    {
                        userId,
                        autonomy: psychometrics.autonomy,
                        competence: psychometrics.competence,
                        relatedness: psychometrics.relatedness
                    }
                )
            );
        } finally {
            await session.close();
        }
    },

    async joinSquad(userId: string, squad: Squad) {
        const session = driver.session();
        try {
            await session.executeWrite(tx =>
                tx.run(
                    `MATCH (u:User {id: $userId})
                     MERGE (s:Squad {id: $squadId})
                     SET s.name = $squadName, s.role = $squadRole
                     MERGE (u)-[r:MEMBER_OF]->(s)
                     RETURN u, s`,
                    {
                        userId,
                        squadId: squad.id,
                        squadName: squad.name,
                        squadRole: squad.role
                    }
                )
            );
        } finally {
            await session.close();
        }
    },

    async completeMission(userId: string, missionId: string, path: HeroPath, wallet: Wallet) {
        const session = driver.session();
        try {
            await session.executeWrite(tx =>
                tx.run(
                    `MATCH (u:User {id: $userId})
                     MERGE (m:Mission {id: $missionId})
                     SET u.xp = $xp, u.level = $level, u.balance = $balance, u.history = $history
                     MERGE (u)-[:COMPLETED]->(m)
                     RETURN u`,
                    {
                        userId,
                        missionId,
                        xp: path.xp,
                        level: path.level,
                        balance: wallet.balance,
                        history: path.history
                    }
                )
            );
        } finally {
            await session.close();
        }
    },

    async fetchUserData(userId: string) {
        const session = driver.session();
        try {
            const result = await session.executeRead(tx =>
                tx.run(
                    `MATCH (u:User {id: $userId})
                     OPTIONAL MATCH (u)-[:MEMBER_OF]->(s:Squad)
                     RETURN u, s`,
                    { userId }
                )
            );

            if (result.records.length === 0) return null;

            const userProps = result.records[0].get('u').properties;
            const squadNode = result.records[0].get('s');

            return {
                profile: {
                    name: userProps.name,
                    age: userProps.age?.toNumber?.() || userProps.age,
                    passion: userProps.passion,
                    style: userProps.style
                } as UserProfile,
                path: {
                    role: userProps.role,
                    currentMission: null,
                    currentMissionId: null,
                    status: "Idle" as const,
                    level: userProps.level?.toNumber?.() || userProps.level,
                    xp: userProps.xp?.toNumber?.() || userProps.xp,
                    history: userProps.history || []
                } as HeroPath,
                wallet: {
                    balance: userProps.balance?.toNumber?.() || userProps.balance
                } as Wallet,
                psychometrics: {
                    autonomy: userProps.autonomy?.toNumber?.() || userProps.autonomy,
                    competence: userProps.competence?.toNumber?.() || userProps.competence,
                    relatedness: userProps.relatedness?.toNumber?.() || userProps.relatedness
                } as Psychometrics,
                squad: squadNode ? {
                    id: squadNode.properties.id,
                    name: squadNode.properties.name,
                    role: squadNode.properties.role
                } as Squad : null
            };
        } finally {
            await session.close();
        }
    },

    async fetchRecommendations(userId: string) {
        const session = driver.session();
        try {
            const result = await session.executeRead(tx =>
                tx.run(
                    `MATCH (u:User {id: $userId})-[:RECOMMENDED]->(m:Mission)
                     RETURN m
                     ORDER BY m.createdAt DESC`,
                    { userId }
                )
            );

            return result.records.map(record => {
                const props = record.get('m').properties;
                return {
                    id: props.id,
                    title: props.title,
                    description: props.description,
                    reward: props.reward?.toNumber?.() || props.reward,
                    type: props.type
                };
            });
        } finally {
            await session.close();
        }
    }
};
