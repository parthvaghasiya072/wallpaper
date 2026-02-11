import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FIXED_SAMPLES = Array.from({ length: 100 }, () => ({
    size: Math.random() * 10 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 18 + 8,
    delay: Math.random() * 5,
    moveX: Math.random() * 40 - 20,
    moveX2: Math.random() * 20 - 10,
}));

const AnimatedBackground = ({
    variant = 'dark',        
    bgColor,                 
    particleCount = 35,
    showOrbs = true,
    showShapes = true,
    showSparkles = true,
    showRipples = true,
    showOrbitals = true,
    showParticles = true,
    showLines = true,
    showLiquidMesh = true,
}) => {
    const isDark = variant === 'dark';

    const resolvedBg = bgColor || (isDark ? '#080616' : '#f8f7ff');

    const colors = useMemo(() => {
        if (isDark) {
            return {
                purple: {
                    orb: '#7c3aed',
                    shape: 'rgba(124,58,237,0.2)',
                    particle: 'rgba(167,139,250,0.4)',
                    sparkle: 'text-purple-300/40',
                    ring: 'border-purple-500/10',
                    dot: 'bg-purple-400/50',
                    ripple: 'border-purple-400/20',
                    line: 'from-purple-500/0 via-purple-500/20 to-purple-500/0'
                },
                blue: {
                    orb: '#2563eb',
                    shape: 'rgba(37,99,235,0.15)',
                    particle: 'rgba(96,165,250,0.35)',
                    ring: 'border-blue-500/10',
                    dot: 'bg-blue-400/40'
                },
                pink: {
                    orb: '#db2777',
                    shape: 'rgba(219,39,119,0.15)',
                    particle: 'rgba(244,114,182,0.3)',
                    ring: 'border-pink-500/10',
                    dot: 'bg-pink-400/30'
                },
                orbOpacity: { main: 'opacity-40', secondary: 'opacity-35', center: 'opacity-30', accent1: 'opacity-25', accent2: 'opacity-20' },
                particleOpacity: [0.3, 0.7, 0.4, 0.3],
                shapeOpacity: [0.4, 0.8, 0.4],
                sparkleOpacity: [0.3, 0.7, 0.3],
                rippleOpacity: [0.5, 0.2, 0],
                lineOpacity: [0, 0.5, 0],
            };
        }
        return {
            purple: { orb: '#e9d5ff', shape: 'rgba(139,92,246,0.15)', particle: 'rgba(139,92,246,0.2)', sparkle: 'text-purple-400/20', ring: 'border-purple-200/10', dot: 'bg-purple-400/20', ripple: 'border-purple-300/15', line: 'from-purple-300/0 via-purple-300/10 to-purple-300/0' },
            blue: { orb: '#bfdbfe', shape: 'rgba(59,130,246,0.1)', particle: 'rgba(59,130,246,0.15)', ring: 'border-blue-200/10', dot: 'bg-blue-400/15' },
            pink: { orb: '#fbcfe8', shape: 'rgba(236,72,153,0.1)', particle: 'rgba(236,72,153,0.15)', ring: 'border-pink-200/8', dot: 'bg-pink-400/12' },
            orbOpacity: { main: 'opacity-25', secondary: 'opacity-20', center: 'opacity-15', accent1: 'opacity-10', accent2: 'opacity-8' },
            particleOpacity: [0.1, 0.4, 0.2, 0.1],
            shapeOpacity: [0.2, 0.5, 0.2],
            sparkleOpacity: [0.1, 0.4, 0.1],
            rippleOpacity: [0.3, 0.1, 0],
            lineOpacity: [0, 0.3, 0],
        };
    }, [isDark]);

    const particles = useMemo(() =>
        FIXED_SAMPLES.slice(0, particleCount).map((s, i) => ({
            ...s,
            id: i,
            color: i % 3 === 0
                ? colors.purple.particle
                : i % 3 === 1
                    ? colors.blue.particle
                    : colors.pink.particle,
        })),
        [particleCount, colors]);

    const blobs = useMemo(() => [
        { id: 0, color: 'bg-indigo-600/10', size: 'w-[100vw] h-[100vw]', x: '-20%', y: '-20%', duration: 30 },
        { id: 1, color: 'bg-blue-600/10', size: 'w-[80vw] h-[80vw]', x: '40%', y: '10%', duration: 35 },
        { id: 2, color: 'bg-purple-600/10', size: 'w-[110vw] h-[110vw]', x: '10%', y: '40%', duration: 40 },
        { id: 3, color: 'bg-sky-600/8', size: 'w-[70vw] h-[70vw]', x: '60%', y: '60%', duration: 25 },
    ], []);

    const shapes = useMemo(() => [
        { id: 0, type: 'square', size: 40, x: '8%', y: '15%', rotate: 360, duration: 25, border: colors.purple.shape },
        { id: 1, type: 'square', size: 25, x: '85%', y: '20%', rotate: -360, duration: 30, border: colors.blue.shape },
        { id: 2, type: 'diamond', size: 35, x: '15%', y: '75%', rotate: 360, duration: 20, border: colors.pink.shape },
        { id: 3, type: 'square', size: 50, x: '75%', y: '70%', rotate: -360, duration: 35, border: colors.purple.shape },
        { id: 4, type: 'diamond', size: 20, x: '90%', y: '50%', rotate: 360, duration: 22, border: colors.blue.shape },
    ], [colors]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: resolvedBg, zIndex: 0 }}>

            {showLiquidMesh && (
                <div className="absolute inset-0 opacity-100 blur-[140px]">
                    {blobs.map((blob) => (
                        <motion.div
                            key={blob.id}
                            className={`absolute rounded-full ${blob.color} ${blob.size}`}
                            style={{ left: blob.x, top: blob.y }}
                            animate={{
                                x: [0, 50, -30, 0],
                                y: [0, -50, 70, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: blob.duration,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

            {showOrbs && (
                <div className="absolute inset-0">
                    <motion.div
                        className={`absolute w-[600px] h-[600px] rounded-full ${colors.orbOpacity.main} blur-[120px]`}
                        style={{ background: `radial-gradient(circle, ${colors.purple.orb}, transparent)`, left: '-5%', top: '10%' }}
                        animate={{ x: [0, 80, -20, 0], y: [0, -40, 40, 0], scale: [1, 1.2, 0.9, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className={`absolute w-[500px] h-[500px] rounded-full ${colors.orbOpacity.secondary} blur-[100px]`}
                        style={{ background: `radial-gradient(circle, ${colors.blue.orb}, transparent)`, right: '-5%', bottom: '10%' }}
                        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0], scale: [1, 1.3, 0.85, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className={`absolute w-[400px] h-[400px] rounded-full ${colors.orbOpacity.center} blur-[90px]`}
                        style={{ background: `radial-gradient(circle, ${colors.pink.orb}, transparent)`, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        animate={{ scale: [1, 1.4, 0.8, 1], opacity: isDark ? [0.3, 0.5, 0.2, 0.3] : [0.15, 0.3, 0.1, 0.15] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            )}

            {showShapes && (
                <div className="absolute inset-0">
                    {shapes.map((shape) => (
                        <motion.div
                            key={shape.id}
                            className="absolute"
                            style={{
                                width: shape.size,
                                height: shape.size,
                                left: shape.x,
                                top: shape.y,
                                border: `2.5px solid ${shape.border}`,
                                borderRadius: shape.type === 'square' ? '8px' : '4px',
                                transform: shape.type === 'diamond' ? 'rotate(45deg)' : 'none',
                            }}
                            animate={{
                                rotate: shape.type === 'diamond' ? [45, 45 + shape.rotate] : [0, shape.rotate],
                                y: [0, -30, 0],
                                opacity: colors.shapeOpacity,
                            }}
                            transition={{
                                rotate: { duration: shape.duration, repeat: Infinity, ease: 'linear' },
                                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                                opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                            }}
                        />
                    ))}
                </div>
            )}

            {showParticles && (
                <div className="absolute inset-0">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                background: `radial-gradient(circle, ${p.color}, transparent)`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, p.moveX, 0],
                                opacity: colors.particleOpacity,
                                scale: [1, 1.4, 1],
                            }}
                            transition={{
                                duration: p.duration,
                                delay: p.delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnimatedBackground;
