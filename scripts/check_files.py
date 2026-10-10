import os

for pno in range(193, 206):
    print(f"p{pno}_l and p{pno}_r exist: {os.path.exists(f'scratch/maths13/p{pno}_l.png')}")
