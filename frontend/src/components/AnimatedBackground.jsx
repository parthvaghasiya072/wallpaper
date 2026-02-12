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
    showSolarSystem = true,
    showShootingStars = true,
    showGrid = true,
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
        { id: 5, type: 'circle', size: 30, x: '45%', y: '10%', rotate: 0, duration: 40, border: colors.pink.shape },
        { id: 6, type: 'circle', size: 45, x: '25%', y: '85%', rotate: 0, duration: 35, border: colors.blue.shape },
        { id: 7, type: 'square', size: 15, x: '60%', y: '30%', rotate: 45, duration: 15, border: colors.purple.shape },
        { id: 8, type: 'triangle', size: 30, x: '35%', y: '40%', rotate: 360, duration: 28, border: colors.purple.shape },
        { id: 9, type: 'plus', size: 25, x: '65%', y: '15%', rotate: 180, duration: 20, border: colors.blue.shape },
    ], [colors]);

    const orbitals = useMemo(() => [
        { id: 0, x: '20%', y: '30%', radius: 60, duration: 25, color: colors.purple.dot, dotSize: 4 },
        { id: 1, x: '80%', y: '70%', radius: 45, duration: 20, color: colors.blue.dot, dotSize: 3 },
        { id: 2, x: '15%', y: '85%', radius: 35, duration: 15, color: colors.pink.dot, dotSize: 3 },
    ], [colors]);

    const ripples = useMemo(() => [
        { id: 0, x: '50%', y: '50%', maxSize: 600, duration: 8, delay: 0 },
        { id: 1, x: '50%', y: '50%', maxSize: 600, duration: 8, delay: 4 },
    ], []);

    const lines = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
        id: i,
        width: Math.random() * 300 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 5
    })), []);

    const sparkles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 5
    })), []);

    const solarSystem = useMemo(() => [
        { id: 0, name: 'Core', size: 100, blur: 'blur-[60px]', color: 'bg-purple-500/10', orbit: 0, duration: 0 },
        { id: 1, name: 'Inner', size: 8, color: colors.purple.dot, orbit: 120, duration: 20, delay: 0 },
        { id: 2, name: 'Middle', size: 12, color: colors.blue.dot, orbit: 220, duration: 35, delay: -5 },
        { id: 3, name: 'Outer', size: 10, color: colors.pink.dot, orbit: 340, duration: 50, delay: -10, hasRing: true },
    ], [colors]);

    const shootingStars = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
        id: i,
        delay: Math.random() * 20,
        duration: Math.random() * 2 + 1.5,
        top: Math.random() * 50,
        left: Math.random() * 100
    })), []);

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
                                border: shape.type === 'plus' || shape.type === 'triangle' ? 'none' : `2.5px solid ${shape.border}`,
                                borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'square' ? '8px' : '4px',
                                transform: shape.type === 'diamond' ? 'rotate(45deg)' : 'none',
                                background: shape.type === 'triangle' ? `linear-gradient(to bottom right, ${shape.border}, transparent)` : 'none',
                                clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
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
                        >
                            {shape.type === 'plus' && (
                                <div className="relative w-full h-full">
                                    <div className="absolute top-1/2 left-0 w-full h-[2.5px]" style={{ backgroundColor: shape.border }} />
                                    <div className="absolute top-0 left-1/2 w-[2.5px] h-full" style={{ backgroundColor: shape.border }} />
                                </div>
                            )}
                        </motion.div>
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

            {showLines && (
                <div className="absolute inset-0 opacity-20">
                    {lines.map((line) => (
                        <motion.div
                            key={line.id}
                            className={`absolute h-[1px] bg-gradient-to-r ${colors.purple.line}`}
                            style={{ width: line.width, left: `${line.x}%`, top: `${line.y}%`, rotate: -45 }}
                            animate={{ x: [-200, 400], opacity: colors.lineOpacity }}
                            transition={{ duration: line.duration, repeat: Infinity, ease: "linear", delay: line.delay }}
                        />
                    ))}
                </div>
            )}

            {showSolarSystem && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Central Glow */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/5 blur-[100px]" />

                    {solarSystem.map((planet) => (
                        <div key={planet.id} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            {/* Orbit Ring */}
                            {planet.orbit > 0 && (
                                <div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.02] rounded-full"
                                    style={{ width: planet.orbit * 2, height: planet.orbit * 2 }}
                                />
                            )}

                            {/* Planet Container for Rotation */}
                            <motion.div
                                className="absolute left-1/2 top-1/2"
                                style={{ width: planet.orbit * 2, height: planet.orbit * 2, marginLeft: -planet.orbit, marginTop: -planet.orbit }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: planet.duration, repeat: Infinity, ease: "linear", delay: planet.delay }}
                            >
                                {/* The Planet */}
                                <div
                                    className={`absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${planet.color} ${planet.blur || 'blur-[1px]'}`}
                                    style={{ width: planet.size, height: planet.size }}
                                >
                                    {planet.hasRing && (
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[30%] border border-white/10 rounded-[100%] rotate-45" />
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            )}

            {showSparkles && (
                <div className="absolute inset-0">
                    {sparkles.map((sparkle) => (
                        <motion.div
                            key={sparkle.id}
                            className={`absolute w-1 h-1 bg-white rounded-full ${colors.purple.sparkle} blur-[1px]`}
                            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
                            animate={{ opacity: colors.sparkleOpacity, scale: [1, 1.5, 1] }}
                            transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }}
                        />
                    ))}
                </div>
            )}

            {showOrbitals && (
                <div className="absolute inset-0">
                    {orbitals.map((orbital) => (
                        <div key={orbital.id} className="absolute" style={{ left: orbital.x, top: orbital.y }}>
                            <motion.div
                                className={`rounded-full ${orbital.color} blur-[1px]`}
                                style={{ width: orbital.dotSize, height: orbital.dotSize }}
                                animate={{
                                    x: [orbital.radius, 0, -orbital.radius, 0, orbital.radius],
                                    y: [0, orbital.radius, 0, -orbital.radius, 0],
                                    opacity: [0.2, 0.6, 0.2]
                                }}
                                transition={{ duration: orbital.duration, repeat: Infinity, ease: "linear" }}
                            />
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[1px] border border-white/5 rounded-full`} style={{ width: orbital.radius * 2, height: orbital.radius * 2 }} />
                        </div>
                    ))}
                </div>
            )}

            {showRipples && (
                <div className="absolute inset-0">
                    {ripples.map((ripple) => (
                        <motion.div
                            key={ripple.id}
                            className={`absolute rounded-full border ${colors.purple.ripple} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                            initial={{ width: 0, height: 0, opacity: 0 }}
                            animate={{
                                width: [0, ripple.maxSize],
                                height: [0, ripple.maxSize],
                                opacity: colors.rippleOpacity
                            }}
                            transition={{ duration: ripple.duration, repeat: Infinity, delay: ripple.delay, ease: "easeOut" }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnimatedBackground;
