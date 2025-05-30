from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import fetch_quiz_questions, ask_openai

class QuizServiceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        text  = """
Quantum Computers: Revolutionizing Computational Paradigms
Quantum computers represent a transformative shift in the field of computation, rooted in the principles of quantum mechanics—superposition, entanglement, and quantum interference. Unlike classical computers, which use binary bits (0 or 1) to perform operations, quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously. This unique property endows quantum computers with the potential to perform complex computations exponentially faster than classical systems for certain problems.

Fundamental Principles
Superposition is the ability of qubits to exist in a combination of 0 and 1 at the same time. This enables quantum systems to process a vast number of states simultaneously. A system of n qubits can represent 2ⁿ different configurations at once, offering immense parallelism.

Entanglement is a non-classical correlation between qubits. When qubits are entangled, the state of one qubit is directly related to the state of another, no matter the distance between them. This phenomenon allows for highly coordinated operations across multiple qubits, which is crucial for quantum error correction and certain quantum algorithms.

Quantum interference allows quantum systems to enhance the probability of correct answers and cancel out incorrect ones during computation. It plays a key role in guiding quantum computations toward meaningful solutions.

Quantum Gates and Circuits
In quantum computing, operations are performed using quantum gates, which manipulate qubits through unitary transformations. These gates—such as the Hadamard gate, Pauli gates (X, Y, Z), and the Controlled-NOT (CNOT) gate—are combined to form quantum circuits. These circuits execute quantum algorithms by evolving the quantum state of the system in a controlled manner.

Unlike classical gates, quantum gates are reversible due to the unitarity of quantum mechanics. This reversibility is a defining characteristic that requires a fundamental rethinking of algorithmic design.

Quantum Algorithms
Several quantum algorithms showcase the potential superiority of quantum computers:

Shor’s algorithm can factor large integers in polynomial time, threatening classical cryptographic systems like RSA.

Grover’s algorithm offers quadratic speedup for unsorted database searches.

Quantum simulation algorithms allow the modeling of complex quantum systems, which is infeasible for classical computers.

These algorithms illustrate scenarios where quantum computers could provide exponential or polynomial advantages, changing the landscape of computational complexity.

Challenges in Quantum Computing
Despite their promise, quantum computers face significant challenges:

Decoherence and noise: Qubits are highly sensitive to environmental interactions, leading to loss of quantum information. Error rates in quantum systems are currently high compared to classical systems.

Scalability: Building a quantum computer with a large number of qubits while maintaining coherence and controllability is a formidable engineering task.

Error correction: Quantum error correction requires encoding logical qubits using multiple physical qubits, significantly increasing resource demands. Techniques like the surface code and topological qubits are under active research.

Current Progress and Applications
Major companies and research institutions—such as IBM, Google, and IonQ—are actively developing quantum hardware and cloud-based quantum platforms. Quantum processors based on superconducting circuits, trapped ions, and photonic systems are being tested for scalability, coherence, and gate fidelity.

Applications extend beyond cryptography and include optimization, materials science, machine learning, and drug discovery. For instance, quantum algorithms can help identify optimal configurations in complex systems or simulate molecular interactions at unprecedented levels of detail.

Conclusion
Quantum computers harness the strange and powerful laws of quantum mechanics to tackle problems that remain intractable for classical machines. While practical, fault-tolerant quantum computing is still a work in progress, the field has made significant strides, transitioning from theoretical constructs to early-stage devices. As the technology matures, it holds the promise of redefining the frontiers of computation and science.

"""
        difficulty = request.data.get('difficulty')
        category = request.data.get('category')
        questions = request.data.get('num_questions')

        if not (text or difficulty or category or questions):
            return Response(
                {"error": "Both 'text_content' and 'quiz_level' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            #Todo:  Add category
            questions = fetch_quiz_questions(text, difficulty, questions)
            print(questions)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response({"questions": questions}, status=status.HTTP_200_OK)
    
class ChatbotServiceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        message  = request.data.get('message')

        if not message:
            return Response(
                {"error": "'message' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = ask_openai(message)
        
        return Response({"message_resp": response}, status=status.HTTP_200_OK)