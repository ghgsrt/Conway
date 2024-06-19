const finalGrade = [
	[0.2, 0.98], // Exam 1
	[0.2, 0.8], // Exam 2
	[0.05, 1], // Final Pres
	[0.2, 1], // Final Paper
	[0.2, 0.7], // Final Exam
	[0.1, 1], // Extra Credit
	[0.15, 1], // Attendance/Participation
].reduce((acc, [weight, score]) => acc + weight * score, 0);

console.log(finalGrade);
